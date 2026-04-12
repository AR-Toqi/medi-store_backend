"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
const getAllUsers = async () => {
    const users = await prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isBanned: true,
            createdAt: true,
            sellerProfile: {
                select: {
                    id: true,
                    shopName: true,
                    isVerified: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return users;
};
const updateUserStatus = async (id, isBanned) => {
    const result = await prisma_1.prisma.user.update({
        where: { id },
        data: { isBanned },
    });
    return result;
};
const deleteUser = async (id) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (!user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Active users cannot be deleted. Please ban the user first.");
    }
    await prisma_1.prisma.user.delete({
        where: { id },
    });
};
const getAllSellers = async () => {
    const sellers = await prisma_1.prisma.sellerProfile.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    isBanned: true
                }
            }
        }
    });
    return sellers;
};
const deleteSeller = async (id) => {
    const cleanId = id.trim();
    // Try to find by Profile ID or User ID (both are unique)
    const seller = await prisma_1.prisma.sellerProfile.findFirst({
        where: {
            OR: [
                { id: cleanId },
                { userId: cleanId }
            ]
        },
        include: { user: true }
    });
    if (!seller) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    }
    // Ensure user is banned before allowing deletion
    if (!seller.user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Active sellers cannot be deleted. Please ban the user account first.");
    }
    try {
        await prisma_1.prisma.sellerProfile.delete({
            where: { id: seller.id },
        });
    }
    catch (error) {
        if (error.code === "P2003") {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "This seller cannot be deleted because they have associated medicines or order history. Please keep the user banned instead.");
        }
        throw error;
    }
};
exports.adminService = {
    getAllUsers,
    updateUserStatus,
    getAllSellers,
    deleteUser,
    deleteSeller,
};
//# sourceMappingURL=admin.service.js.map