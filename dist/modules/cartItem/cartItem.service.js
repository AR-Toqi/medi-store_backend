"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemService = exports.clearCart = exports.removeFromCart = exports.updateCartItemQuantity = exports.getCartItems = exports.addToCart = void 0;
const prisma_1 = require("../../lib/prisma");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
/**
 * Add item to cart or update quantity if already exists
 */
const addToCart = async (payload) => {
    const { userId, medicineId, quantity = 1 } = payload;
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Validate medicine exists and has stock
    const medicine = await prisma_1.prisma.medicine.findUnique({
        where: { id: medicineId },
        include: {
            category: true,
            seller: {
                select: {
                    shopName: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });
    if (!medicine) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Medicine not found");
    }
    if (medicine.stock < quantity) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock. Available: ${medicine.stock}, Requested: ${quantity}`);
    }
    if (quantity <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be greater than 0");
    }
    // Check if item already exists in cart
    const existingCartItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            userId_medicineId: {
                userId,
                medicineId,
            },
        },
    });
    if (existingCartItem) {
        // Update quantity
        const newQuantity = existingCartItem.quantity + quantity;
        if (medicine.stock < newQuantity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock. Available: ${medicine.stock}, Total in cart would be: ${newQuantity}`);
        }
        const updatedCartItem = await prisma_1.prisma.cartItem.update({
            where: {
                userId_medicineId: {
                    userId,
                    medicineId,
                },
            },
            data: {
                quantity: newQuantity,
            },
            include: {
                medicine: {
                    include: {
                        category: true,
                        seller: {
                            select: {
                                shopName: true,
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return updatedCartItem;
    }
    else {
        // Create new cart item
        const cartItem = await prisma_1.prisma.cartItem.create({
            data: {
                userId,
                medicineId,
                quantity,
            },
            include: {
                medicine: {
                    include: {
                        category: true,
                        seller: {
                            select: {
                                shopName: true,
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return cartItem;
    }
};
exports.addToCart = addToCart;
/**
 * Get all cart items for a user
 */
const getCartItems = async (userId) => {
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const cartItems = await prisma_1.prisma.cartItem.findMany({
        where: { userId },
        include: {
            medicine: {
                include: {
                    category: true,
                    seller: {
                        select: {
                            shopName: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    // Calculate totals and check stock availability
    const cartWithTotals = cartItems.map(item => {
        const isAvailable = item.medicine.stock >= item.quantity;
        const itemTotal = Number(item.medicine.price) * item.quantity;
        return {
            ...item,
            isAvailable,
            itemTotal,
            medicine: {
                ...item.medicine,
                price: Number(item.medicine.price),
            },
        };
    });
    const cartTotal = cartWithTotals.reduce((total, item) => total + item.itemTotal, 0);
    const totalItems = cartWithTotals.reduce((total, item) => total + item.quantity, 0);
    const hasUnavailableItems = cartWithTotals.some(item => !item.isAvailable);
    return {
        items: cartWithTotals,
        summary: {
            totalItems,
            cartTotal,
            hasUnavailableItems,
        },
    };
};
exports.getCartItems = getCartItems;
/**
 * Update cart item quantity
 */
const updateCartItemQuantity = async (userId, medicineId, quantity) => {
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (quantity <= 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be greater than 0");
    }
    // Check if cart item exists and belongs to user
    const cartItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            userId_medicineId: {
                userId,
                medicineId,
            },
        },
        include: {
            medicine: true,
        },
    });
    if (!cartItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart item not found");
    }
    // Validate stock availability
    if (cartItem.medicine.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${cartItem.medicine.stock}, Requested: ${quantity}`);
    }
    // Update quantity
    const updatedCartItem = await prisma_1.prisma.cartItem.update({
        where: {
            userId_medicineId: {
                userId,
                medicineId,
            },
        },
        data: {
            quantity,
        },
        include: {
            medicine: {
                include: {
                    category: true,
                    seller: {
                        select: {
                            shopName: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    return updatedCartItem;
};
exports.updateCartItemQuantity = updateCartItemQuantity;
/**
 * Remove item from cart
 */
const removeFromCart = async (userId, medicineId) => {
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Check if cart item exists and belongs to user
    const cartItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            userId_medicineId: {
                userId,
                medicineId,
            },
        },
    });
    if (!cartItem) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart item not found");
    }
    // Delete cart item
    await prisma_1.prisma.cartItem.delete({
        where: {
            userId_medicineId: {
                userId,
                medicineId,
            },
        },
    });
    return { message: "Item removed from cart successfully" };
};
exports.removeFromCart = removeFromCart;
/**
 * Clear entire cart
 */
const clearCart = async (userId) => {
    // Validate user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Delete all cart items for user
    await prisma_1.prisma.cartItem.deleteMany({
        where: { userId },
    });
    return { message: "Cart cleared successfully" };
};
exports.clearCart = clearCart;
exports.cartItemService = {
    addToCart: exports.addToCart,
    getCartItems: exports.getCartItems,
    updateCartItemQuantity: exports.updateCartItemQuantity,
    removeFromCart: exports.removeFromCart,
    clearCart: exports.clearCart,
};
//# sourceMappingURL=cartItem.service.js.map