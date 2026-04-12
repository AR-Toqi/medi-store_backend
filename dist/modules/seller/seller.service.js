"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerService = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_2 = require("../../../generated/prisma");
/**
 * Get seller profile by user ID
 */
const getSellerProfileByUserId = async (userId) => {
    const profile = await prisma_1.prisma.sellerProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    if (!profile) {
        throw new Error("Seller profile not found. Please create a seller profile first.");
    }
    return profile;
};
/**
 * Get seller-specific dashboard statistics
 */
const getDashboardStats = async (sellerId) => {
    // 1. Total Medicines
    const totalMedicines = await prisma_1.prisma.medicine.count({
        where: { sellerId },
    });
    // 2. Total Orders (Orders containing at least one of this seller's medicines)
    const totalOrders = await prisma_1.prisma.order.count({
        where: {
            items: {
                some: {
                    medicine: {
                        sellerId,
                    },
                },
            },
        },
    });
    // 3. Total Sales / Revenue
    // We only count revenue from orders that are not CANCELLED
    const items = await prisma_1.prisma.orderItem.findMany({
        where: {
            medicine: {
                sellerId,
            },
            order: {
                status: {
                    not: prisma_2.OrderStatus.CANCELLED,
                },
            },
        },
        select: {
            price: true,
            quantity: true,
        },
    });
    const totalRevenue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // 4. Pending Orders count
    const pendingOrders = await prisma_1.prisma.order.count({
        where: {
            status: prisma_2.OrderStatus.PLACED,
            items: {
                some: {
                    medicine: {
                        sellerId,
                    },
                },
            },
        },
    });
    return {
        totalMedicines,
        totalOrders,
        totalRevenue,
        pendingOrders,
    };
};
exports.sellerService = {
    getSellerProfileByUserId,
    getDashboardStats,
};
//# sourceMappingURL=seller.service.js.map