import { prisma } from "../../lib/prisma";
import { OrderStatus, Role } from "../../../generated/prisma/enums";
import type { CreateOrderPayload, UpdateOrderStatusPayload, GetOrdersParams } from "../../types/order.d";

/**
 * Create a new order
 */
export const createOrder = async (payload: CreateOrderPayload) => {
  // Validate customer exists
  const customer = await prisma.user.findUnique({
    where: { id: payload.customerId },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Validate all medicines exist and calculate total
  let totalAmount = 0;
  const orderItems: Array<{
    medicineId: string;
    quantity: number;
    price: number;
  }> = [];

  for (const item of payload.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
      include: { seller: true },
    });

    if (!medicine) {
      throw new Error(`Medicine with ID ${item.medicineId} not found`);
    }

    if (medicine.stock < item.quantity) {
      throw new Error(`Insufficient stock for medicine: ${medicine.name}`);
    }

    const itemTotal = Number(medicine.price) * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      medicineId: item.medicineId,
      quantity: item.quantity,
      price: Number(medicine.price),
    });
  }

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        customerId: payload.customerId,
        totalAmount,
        shippingAddress: payload.shippingAddress,
        paymentMethod: payload.paymentMethod || "COD",
      },
    });

    // Create order items
    await tx.orderItem.createMany({
      data: orderItems.map(item => ({
        orderId: newOrder.id,
        ...item,
      })),
    });

    // Update medicine stock
    for (const item of payload.items) {
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

  return order;
};

/**
 * ADMIN: Get all orders with pagination and filtering
 */
export const getAllOrders = async (params: GetOrdersParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";

  const skip = (page - 1) * limit;

  // Build where condition
  const whereCondition: any = {};

  if (params.status) {
    whereCondition.status = params.status;
  }

  if (search) {
    whereCondition.OR = [
      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        customer: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        id: {
          contains: search,
        },
      },
    ];
  }

  // Get total count
  const total = await prisma.order.count({
    where: whereCondition,
  });

  // Get orders with details
  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              seller: {
                select: {
                  id: true,
                  shopName: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

/**
 * SELLER: Get orders containing seller's medicines
 */
export const getOrdersBySeller = async (sellerId: string, params: GetOrdersParams) => {
  // Validate seller exists
  const seller = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
  });

  if (!seller) {
    throw new Error("Seller not found");
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";

  const skip = (page - 1) * limit;

  // Build where condition - orders that contain seller's medicines
  const whereCondition: any = {
    items: {
      some: {
        medicine: {
          sellerId,
        },
      },
    },
  };

  if (params.status) {
    whereCondition.status = params.status;
  }

  if (search) {
    whereCondition.OR = [
      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        customer: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        id: {
          contains: search,
        },
      },
    ];
  }

  // Get total count
  const total = await prisma.order.count({
    where: whereCondition,
  });

  // Get orders with details
  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              seller: {
                select: {
                  id: true,
                  shopName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

/**
 * Get order details by ID
 */
export const getOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              seller: {
                select: {
                  id: true,
                  shopName: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

/**
 * ADMIN: Update order status
 */
export const updateOrderStatus = async (payload: UpdateOrderStatusPayload) => {
  const { orderId, status, userRole, userId } = payload;

  // Validate order exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Validate status transition (basic validation)
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  // For admin, allow all status changes
  // For seller, only allow certain status changes and only for their orders
  if (userRole === Role.SELLER) {
    // Check if the order contains seller's medicines
    const orderWithItems = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    const hasSellerMedicines = orderWithItems?.items.some(
      item => item.medicine.sellerId === userId
    );

    if (!hasSellerMedicines) {
      throw new Error("You can only update orders containing your medicines");
    }

    // Sellers can only change status to CONFIRMED, SHIPPED, or DELIVERED
    const allowedStatuses: OrderStatus[] = [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Sellers can only set status to CONFIRMED, SHIPPED, or DELIVERED");
    }
  }

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              seller: {
                select: {
                  shopName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return updatedOrder;
};

/**
 * Get customer's orders
 */
export const getCustomerOrders = async (customerId: string, params: GetOrdersParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    customerId,
  };

  if (params.status) {
    whereCondition.status = params.status;
  }

  const total = await prisma.order.count({
    where: whereCondition,
  });

  const orders = await prisma.order.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

export const orderService = {
  createOrder,
  getAllOrders,
  getOrdersBySeller,
  getOrderDetails,
  updateOrderStatus,
  getCustomerOrders,
};

