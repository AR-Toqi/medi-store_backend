import { prisma } from "../../lib/prisma";
import type {
    CreateSellerProfileInput,
    UpdateSellerProfileInput,
    CreateSellerProfilePayload,
    UpdateSellerProfilePayload,
} from "../../types/sellerProfile.d";

// Seller Profile CRUD
export const createSellerProfile = async (payload: CreateSellerProfileInput) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if seller profile already exists
    const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId: payload.userId },
    });

    if (existingProfile) {
        throw new Error("Seller profile already exists for this user");
    }

    // Create seller profile
    const sellerProfile = await prisma.sellerProfile.create({
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

    return sellerProfile;
};

export const getSellerProfile = async (userId: string) => {
    const sellerProfile = await prisma.sellerProfile.findUnique({
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

export const updateSellerProfile = async (userId: string, payload: UpdateSellerProfileInput) => {
    // Check if seller profile exists
    const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId },
    });

    if (!existingProfile) {
        throw new Error("Seller profile not found");
    }

    // Update seller profile
    const updatedProfile = await prisma.sellerProfile.update({
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

export const deleteSellerProfile = async (userId: string) => {
    // Check if seller profile exists
    const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId },
    });

    if (!existingProfile) {
        throw new Error("Seller profile not found");
    }

    // Delete seller profile (this will cascade delete medicines due to schema)
    await prisma.sellerProfile.delete({
        where: { userId },
    });

    return { message: "Seller profile deleted successfully" };
};

// Admin function to get all sellers
export const getAllSellers = async () => {
    const sellers = await prisma.sellerProfile.findMany({
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

export const sellerProfileService = {
    createSellerProfile,
    getSellerProfile,
    updateSellerProfile,
    deleteSellerProfile,
    getAllSellers,
};

