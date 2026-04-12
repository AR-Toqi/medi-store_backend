"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_2 = require("../../../generated/prisma");
const email_1 = require("../../app/utils/email");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
/**
 * Format address object into a readable shipping address string
 */
const formatAddressToString = (address) => {
    const parts = [
        address.fullName,
        address.addressLine,
    ];
    if (address.area)
        parts.push(address.area);
    parts.push(address.city);
    parts.push(address.state);
    if (address.postalCode)
        parts.push(address.postalCode);
    if (address.country)
        parts.push(address.country);
    return parts.filter(Boolean).join(", ");
};
/**
 * Create a new order
 */
const createOrder = async (payload) => {
    const customer = await prisma_1.prisma.user.findUnique({
        where: { id: payload.customerId },
    });
    if (!customer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
    }
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItems = [];
        // 1. Double-check stock inside transaction
        for (const item of payload.items) {
            const medicine = await tx.medicine.findUnique({
                where: { id: item.medicineId },
            });
            if (!medicine) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Medicine with ID ${item.medicineId} not found`);
            }
            if (medicine.stock < item.quantity) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for medicine: ${medicine.name}`);
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
        await (0, email_1.sendEmail)({
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
const createOrderFromCart = async (customerId, payload) => {
    const { addressId } = payload;
    const address = await prisma_1.prisma.address.findUnique({
        where: { id: addressId },
    });
    if (!address) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Address not found");
    }
    if (address.userId !== customerId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Access denied. Address does not belong to you");
    }
    const shippingAddress = formatAddressToString(address);
    const cartItems = await prisma_1.prisma.cartItem.findMany({
        where: { userId: customerId },
        include: { medicine: true },
    });
    if (!cartItems || cartItems.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItems = [];
        // 1. Check stock for each item inside transaction
        for (const ci of cartItems) {
            const med = await tx.medicine.findUnique({
                where: { id: ci.medicineId },
            });
            if (!med) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Medicine not found for cart item ${ci.id}`);
            }
            if (med.stock < ci.quantity) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for medicine: ${med.name}`);
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
const getAllOrders = async (params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const search = params.search?.trim() || "";
    const skip = (page - 1) * limit;
    const whereCondition = {};
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
    const total = await prisma_1.prisma.order.count({ where: whereCondition });
    const orders = await prisma_1.prisma.order.findMany({
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
const getOrdersBySeller = async (sellerId, params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const search = params.search?.trim() || "";
    const skip = (page - 1) * limit;
    const whereCondition = {
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
    const total = await prisma_1.prisma.order.count({ where: whereCondition });
    const orders = await prisma_1.prisma.order.findMany({
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
const getOrderDetails = async (orderId) => {
    const order = await prisma_1.prisma.order.findUnique({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    return order;
};
/**
 * Update order status (Admin/Seller)
 */
const updateOrderStatus = async (payload) => {
    const { orderId, status, userRole, userId } = payload;
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    if (userRole === prisma_2.Role.SELLER) {
        const orderWithItems = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { medicine: true } }
            }
        });
        const hasSellerMedicines = orderWithItems?.items.some(item => item.medicine.sellerId === userId);
        if (!hasSellerMedicines) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You can only update orders containing your medicines");
        }
        const allowedStatuses = [prisma_2.OrderStatus.PROCESSING, prisma_2.OrderStatus.SHIPPED, prisma_2.OrderStatus.DELIVERED];
        if (!allowedStatuses.includes(status)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Sellers can only set status to PROCESSING, SHIPPED, or DELIVERED");
        }
    }
    const updatedOrder = await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
            customer: { select: { id: true, name: true, email: true } }
        },
    });
    if (updatedOrder.customer?.email) {
        await (0, email_1.sendEmail)({
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
const cancelOrder = async (orderId, customerId) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    if (order.customerId !== customerId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized: You can only cancel your own orders");
    }
    if (order.status !== prisma_2.OrderStatus.PLACED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Order cannot be cancelled as it is already in ${order.status} status`);
    }
    const cancelledOrder = await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Update status
        const updated = await tx.order.update({
            where: { id: orderId },
            data: { status: prisma_2.OrderStatus.CANCELLED },
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
const getCustomerOrders = async (customerId, params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const skip = (page - 1) * limit;
    const whereCondition = { customerId };
    if (params.status) {
        whereCondition.status = params.status;
    }
    const total = await prisma_1.prisma.order.count({ where: whereCondition });
    const orders = await prisma_1.prisma.order.findMany({
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
exports.orderService = {
    createOrder,
    createOrderFromCart,
    getAllOrders,
    getOrdersBySeller,
    getOrderDetails,
    updateOrderStatus,
    getCustomerOrders,
    cancelOrder,
};
//# sourceMappingURL=order.service.js.map