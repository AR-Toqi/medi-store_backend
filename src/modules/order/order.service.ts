import { prisma } from "../../lib/prisma";
import { OrderStatus, Role } from "@prisma/client";
import type { CreateOrderPayload, UpdateOrderStatusPayload, GetOrdersParams } from "../../types/order.d";
import { sendEmail } from "../../app/utils/email";
import httpStatus from "http-status";
import AppError from "../../app/errors/AppError";

/**
 * Format address object into a readable shipping address string
 */
const formatAddressToString = (address: any): string => {
  const parts = [
    address.fullName,
    address.addressLine,
  ];

  if (address.area) parts.push(address.area);
  parts.push(address.city);
  parts.push(address.state);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);

  return parts.filter(Boolean).join(", ");
};

/**
 * Create a new order
 */
const createOrder = async (payload: CreateOrderPayload) => {
  const customer = await prisma.user.findUnique({
    where: { id: payload.customerId },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const order = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItems: Array<{
      medicineId: string;
      quantity: number;
      price: number;
    }> = [];

    // 1. Double-check stock inside transaction
    for (const item of payload.items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine) {
        throw new AppError(httpStatus.NOT_FOUND, `Medicine with ID ${item.medicineId} not found`);
      }

      if (medicine.stock < item.quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for medicine: ${medicine.name}`);
      }

      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: Number(medicine.price),
      });
    }

    const newOrder = await tx.order.create({
      data: {
        customerId: payload.customerId,
        totalAmount,
        shippingAddress: payload.shippingAddress,
        paymentMethod: payload.paymentMethod || "COD",
      },
    });

    await tx.orderItem.createMany({
      data: orderItems.map(item => ({
        orderId: newOrder.id,
        ...item,
      })),
    });

    for (const item of orderItems) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newOrder;
  });

  if (customer?.email) {
    await sendEmail({
      to: customer.email,
      subject: "Order Placed Successfully",
      html: `<p>Dear ${customer.name || "Customer"},</p><p>Your order (ID: ${order.id}) has been placed successfully. We will notify you as it progresses.</p>`
    });
  }
  return order;
};

/**
 * Create order from user's cart items (checkout)
 */
const createOrderFromCart = async (customerId: string, payload: { addressId: string; paymentMethod?: string; customerNote?: string }) => {
  const { addressId } = payload;

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address) {
    throw new AppError(httpStatus.NOT_FOUND, "Address not found");
  }

  if (address.userId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied. Address does not belong to you");
  }

  const shippingAddress = formatAddressToString(address);
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: customerId },
    include: { medicine: true },
  });

  if (!cartItems || cartItems.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  const order = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItems: any[] = [];

    // 1. Check stock for each item inside transaction
    for (const ci of cartItems) {
      const med = await tx.medicine.findUnique({
        where: { id: ci.medicineId },
      });

      if (!med) {
        throw new AppError(httpStatus.NOT_FOUND, `Medicine not found for cart item ${ci.id}`);
      }

      if (med.stock < ci.quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for medicine: ${med.name}`);
      }

      totalAmount += Number(med.price) * ci.quantity;
      orderItems.push({
        medicineId: med.id,
        quantity: ci.quantity,
        price: Number(med.price),
      });

      // 2. Decrement stock
      await tx.medicine.update({
        where: { id: ci.medicineId },
        data: { stock: { decrement: ci.quantity } },
      });
    }

    const newOrder = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        shippingAddress,
        paymentMethod: payload.paymentMethod || "COD",
      },
    });

    await tx.orderItem.createMany({
      data: orderItems.map((it) => ({ orderId: newOrder.id, ...it })),
    });

    await tx.cartItem.deleteMany({ where: { userId: customerId } });

    return newOrder;
  });

  return order;
};

/**
 * ADMIN: Get all orders
 */
const getAllOrders = async (params: GetOrdersParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";

  const skip = (page - 1) * limit;
  const whereCondition: any = {};

  if (params.status) {
    whereCondition.status = params.status;
  }

  if (search) {
    whereCondition.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
      { id: { contains: search } },
    ];
  }

  const total = await prisma.order.count({ where: whereCondition });

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              seller: {
                select: { id: true, shopName: true }
              }
            }
          }
        }
      }
    },
  });

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: orders,
  };
};

/**
 * SELLER: Get orders containing seller's medicines
 */
const getOrdersBySeller = async (sellerId: string, params: GetOrdersParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";

  const skip = (page - 1) * limit;
  const whereCondition: any = {
    items: {
      some: { medicine: { sellerId } }
    }
  };

  if (params.status) {
    whereCondition.status = params.status;
  }

  if (search) {
    whereCondition.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
      { id: { contains: search } },
    ];
  }

  const total = await prisma.order.count({ where: whereCondition });

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              seller: { select: { id: true, shopName: true } }
            }
          }
        }
      }
    },
  });

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: orders,
  };
};

/**
 * Get order details by ID
 */
const getOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              seller: { select: { id: true, shopName: true } }
            }
          }
        }
      }
    },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

/**
 * Update order status (Admin/Seller)
 */
const updateOrderStatus = async (payload: UpdateOrderStatusPayload) => {
  const { orderId, status, userRole, userId } = payload;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (userRole === Role.SELLER) {
    const orderWithItems = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { medicine: true } }
      }
    });

    const hasSellerMedicines = orderWithItems?.items.some(
      item => item.medicine.sellerId === userId
    );

    if (!hasSellerMedicines) {
      throw new AppError(httpStatus.FORBIDDEN, "You can only update orders containing your medicines");
    }

    const allowedStatuses: OrderStatus[] = [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    if (!allowedStatuses.includes(status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Sellers can only set status to PROCESSING, SHIPPED, or DELIVERED");
    }
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      customer: { select: { id: true, name: true, email: true } }
    },
  });

  if (updatedOrder.customer?.email) {
    await sendEmail({
      to: updatedOrder.customer.email,
      subject: `Order Update - ${status}`,
      html: `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) status is now <b>${status}</b>.</p>`
    });
  }
  return updatedOrder;
};

/**
 * Customer: Cancel order
 */
const cancelOrder = async (orderId: string, customerId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Unauthorized: You can only cancel your own orders");
  }

  if (order.status !== OrderStatus.PLACED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order cannot be cancelled as it is already in ${order.status} status`
    );
  }

  const cancelledOrder = await prisma.$transaction(async (tx) => {
    // 1. Update status
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    // 2. Restore stock
    for (const item of order.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return updated;
  });

  return cancelledOrder;
};

/**
 * Get customer's orders
 */
const getCustomerOrders = async (customerId: string, params: GetOrdersParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  const skip = (page - 1) * limit;
  const whereCondition: any = { customerId };

  if (params.status) {
    whereCondition.status = params.status;
  }

  const total = await prisma.order.count({ where: whereCondition });

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          medicine: { select: { id: true, name: true, price: true, imageUrl: true } }
        }
      }
    },
  });

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: orders,
  };
};

export const orderService = {
  createOrder,
  createOrderFromCart,
  getAllOrders,
  getOrdersBySeller,
  getOrderDetails,
  updateOrderStatus,
  getCustomerOrders,
  cancelOrder,
};
