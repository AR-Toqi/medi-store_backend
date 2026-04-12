import type { CreateMedicineInput, UpdateMedicineInput, GetMedicinesParams } from '../../types/medicine.d';
/**
 * Public: Get all medicines with advanced filtering
 */
export declare const getAllMedicines: (params: GetMedicinesParams) => Promise<{
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: {
        price: number;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }[];
}>;
/**
 * Public: Get medicine details
 */
export declare const getMedicineDetails: (slug: string) => Promise<{
    price: number;
    reviews: ({
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    })[];
    category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    };
    seller: {
        user: {
            name: string;
            email: string;
        };
        id: string;
        shopName: string;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    description: string | null;
    categoryId: string;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    isFeatured: boolean;
    dosageForm: string | null;
    sellerId: string;
}>;
/**
 * Seller/Admin: Create medicine
 */
export declare const createMedicineForSeller: (sellerId: string, payload: CreateMedicineInput) => Promise<{
    price: number;
    category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    description: string | null;
    categoryId: string;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    isFeatured: boolean;
    dosageForm: string | null;
    sellerId: string;
}>;
export declare const getMedicinesBySeller: (sellerId: string, params: GetMedicinesParams) => Promise<{
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: {
        price: number;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }[];
}>;
export declare const updateMedicineBySeller: (sellerId: string, medicineId: string, payload: UpdateMedicineInput) => Promise<{
    price: number;
    category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    description: string | null;
    categoryId: string;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    isFeatured: boolean;
    dosageForm: string | null;
    sellerId: string;
}>;
export declare const deleteMedicineBySeller: (sellerId: string, medicineId: string) => Promise<{
    message: string;
}>;
export declare const getMedicineDetailsBySeller: (sellerId: string, slug: string) => Promise<{
    price: number;
    reviews: ({
        user: {
            name: string;
            role: string | null;
            isBanned: boolean | null;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            image: string | null;
            password: string | null;
            verificationCode: string | null;
            verificationCodeExpires: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    })[];
    category: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        image: string | null;
        slug: string;
        isActive: boolean;
        description: string | null;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
    description: string | null;
    categoryId: string;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    isFeatured: boolean;
    dosageForm: string | null;
    sellerId: string;
}>;
export declare const medicineService: {
    getAllMedicines: (params: GetMedicinesParams) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: {
            price: number;
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                slug: string;
                isActive: boolean;
                description: string | null;
            };
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            categoryId: string;
            stock: number;
            manufacturer: string;
            imageUrl: string | null;
            isFeatured: boolean;
            dosageForm: string | null;
            sellerId: string;
        }[];
    }>;
    getMedicineDetails: (slug: string) => Promise<{
        price: number;
        reviews: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            comment: string;
            medicineId: string;
        })[];
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        seller: {
            user: {
                name: string;
                email: string;
            };
            id: string;
            shopName: string;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }>;
    createMedicineForSeller: (sellerId: string, payload: CreateMedicineInput) => Promise<{
        price: number;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }>;
    getMedicinesBySeller: (sellerId: string, params: GetMedicinesParams) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: {
            price: number;
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                slug: string;
                isActive: boolean;
                description: string | null;
            };
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            categoryId: string;
            stock: number;
            manufacturer: string;
            imageUrl: string | null;
            isFeatured: boolean;
            dosageForm: string | null;
            sellerId: string;
        }[];
    }>;
    updateMedicineBySeller: (sellerId: string, medicineId: string, payload: UpdateMedicineInput) => Promise<{
        price: number;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }>;
    deleteMedicineBySeller: (sellerId: string, medicineId: string) => Promise<{
        message: string;
    }>;
    getMedicineDetailsBySeller: (sellerId: string, slug: string) => Promise<{
        price: number;
        reviews: ({
            user: {
                name: string;
                role: string | null;
                isBanned: boolean | null;
                email: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                emailVerified: boolean;
                image: string | null;
                password: string | null;
                verificationCode: string | null;
                verificationCodeExpires: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            comment: string;
            medicineId: string;
        })[];
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            slug: string;
            isActive: boolean;
            description: string | null;
        };
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    }>;
};
//# sourceMappingURL=medicine.service.d.ts.map