"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerProfileService = exports.getAllSellers = exports.deleteSellerProfile = exports.updateSellerProfile = exports.getSellerProfile = exports.createSellerProfile = void 0;
const prisma_1 = require("../../lib/prisma");
// Seller Profile CRUD
const createSellerProfile = async (payload) => {
    // Check if user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: payload.userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    // Check if seller profile already exists
    const existingProfile = await prisma_1.prisma.sellerProfile.findUnique({
        where: { userId: payload.userId },
    });
    if (existingProfile) {
        throw new Error("Seller profile already exists for this user");
    }
    // Create seller profile and update user role in a transaction
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const sellerProfile = await tx.sellerProfile.create({
            data: {
                userId: payload.userId,
                shopName: payload.shopName,
                ...(payload.shopDescription && { shopDescription: payload.shopDescription }),
                ...(payload.licenseNumber && { licenseNumber: payload.licenseNumber }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // Update user role to SELLER
        await tx.user.update({
            where: { id: payload.userId },
            data: { role: "SELLER" },
        });
        return sellerProfile;
    });
    return result;
};
exports.createSellerProfile = createSellerProfile;
const getSellerProfile = async (userId) => {
    const sellerProfile = await prisma_1.prisma.sellerProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!sellerProfile) {
        throw new Error("Seller profile not found");
    }
    return sellerProfile;
};
exports.getSellerProfile = getSellerProfile;
const updateSellerProfile = async (userId, payload) => {
    // Check if seller profile exists
    const existingProfile = await prisma_1.prisma.sellerProfile.findUnique({
        where: { userId },
    });
    if (!existingProfile) {
        throw new Error("Seller profile not found");
    }
    // Update seller profile
    const updatedProfile = await prisma_1.prisma.sellerProfile.update({
        where: { userId },
        data: {
            ...(payload.shopName && { shopName: payload.shopName }),
            ...(payload.shopDescription !== undefined && { shopDescription: payload.shopDescription }),
            ...(payload.shopLogo !== undefined && { shopLogo: payload.shopLogo }),
            ...(payload.licenseNumber !== undefined && { licenseNumber: payload.licenseNumber }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return updatedProfile;
};
exports.updateSellerProfile = updateSellerProfile;
const deleteSellerProfile = async (userId) => {
    // Check if seller profile exists
    const existingProfile = await prisma_1.prisma.sellerProfile.findUnique({
        where: { userId },
    });
    if (!existingProfile) {
        throw new Error("Seller profile not found");
    }
    // Delete seller profile (this will cascade delete medicines due to schema)
    await prisma_1.prisma.sellerProfile.delete({
        where: { userId },
    });
    return { message: "Seller profile deleted successfully" };
};
exports.deleteSellerProfile = deleteSellerProfile;
// Admin function to get all sellers
const getAllSellers = async () => {
    const sellers = await prisma_1.prisma.sellerProfile.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    medicines: true,
                },
            },
        },
    });
    return sellers;
};
exports.getAllSellers = getAllSellers;
exports.sellerProfileService = {
    createSellerProfile: exports.createSellerProfile,
    getSellerProfile: exports.getSellerProfile,
    updateSellerProfile: exports.updateSellerProfile,
    deleteSellerProfile: exports.deleteSellerProfile,
    getAllSellers: exports.getAllSellers,
};
//# sourceMappingURL=sellerProfile.service.js.map