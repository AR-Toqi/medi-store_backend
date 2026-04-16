import { prisma } from "../../lib/prisma";
import type {
    CreateSellerProfileInput,
    UpdateSellerProfileInput,
    CreateSellerProfilePayload,
    UpdateSellerProfilePayload,
} from "../../types/sellerProfile.d";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary";

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

    // Create seller profile and update user role in a transaction
    const result = await prisma.$transaction(async (tx) => {
        const sellerProfile = await tx.sellerProfile.create({
            data: {
                userId: payload.userId,
                shopName: payload.shopName,
                ...(payload.shopDescription && { shopDescription: payload.shopDescription }),
                ...(payload.licenseNumber && { licenseNumber: payload.licenseNumber }),
                ...(payload.shopLogo && { shopLogo: payload.shopLogo }),
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

    // Delete old logo if a new one is successfully uploaded
    if (payload.shopLogo && existingProfile.shopLogo) {
        const publicId = extractPublicId(existingProfile.shopLogo);
        if (publicId) await deleteFromCloudinary(publicId);
    }

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

    // 1. Fetch all medicines to delete their images from Cloudinary
    const medicines = await prisma.medicine.findMany({
        where: { sellerId: existingProfile.id }
    });

    // 2. Delete all medicine images from Cloudinary
    for (const medicine of medicines) {
        if (medicine.imageUrl && !medicine.imageUrl.includes("placehold.co")) {
            const publicId = extractPublicId(medicine.imageUrl);
            if (publicId) await deleteFromCloudinary(publicId);
        }
    }

    // 3. Delete shop logo from Cloudinary
    if (existingProfile.shopLogo) {
        const publicId = extractPublicId(existingProfile.shopLogo);
        if (publicId) await deleteFromCloudinary(publicId);
    }

    // 4. Delete seller profile (this will cascade delete medicines due to schema)
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

