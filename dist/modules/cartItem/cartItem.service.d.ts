import type { CreateCartItemPayload } from "../../types/cartItem.d";
/**
 * Add item to cart or update quantity if already exists
 */
export declare const addToCart: (payload: CreateCartItemPayload) => Promise<{
    medicine: {
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
            };
            shopName: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    medicineId: string;
    quantity: number;
}>;
/**
 * Get all cart items for a user
 */
export declare const getCartItems: (userId: string) => Promise<{
    items: {
        isAvailable: boolean;
        itemTotal: number;
        medicine: {
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
            seller: {
                user: {
                    name: string;
                };
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
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        medicineId: string;
        quantity: number;
    }[];
    summary: {
        totalItems: number;
        cartTotal: number;
        hasUnavailableItems: boolean;
    };
}>;
/**
 * Update cart item quantity
 */
export declare const updateCartItemQuantity: (userId: string, medicineId: string, quantity: number) => Promise<{
    medicine: {
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
            };
            shopName: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        stock: number;
        manufacturer: string;
        imageUrl: string | null;
        isFeatured: boolean;
        dosageForm: string | null;
        sellerId: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    medicineId: string;
    quantity: number;
}>;
/**
 * Remove item from cart
 */
export declare const removeFromCart: (userId: string, medicineId: string) => Promise<{
    message: string;
}>;
/**
 * Clear entire cart
 */
export declare const clearCart: (userId: string) => Promise<{
    message: string;
}>;
export declare const cartItemService: {
    addToCart: (payload: CreateCartItemPayload) => Promise<{
        medicine: {
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
                };
                shopName: string;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            categoryId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            manufacturer: string;
            imageUrl: string | null;
            isFeatured: boolean;
            dosageForm: string | null;
            sellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        medicineId: string;
        quantity: number;
    }>;
    getCartItems: (userId: string) => Promise<{
        items: {
            isAvailable: boolean;
            itemTotal: number;
            medicine: {
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
                seller: {
                    user: {
                        name: string;
                    };
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
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            medicineId: string;
            quantity: number;
        }[];
        summary: {
            totalItems: number;
            cartTotal: number;
            hasUnavailableItems: boolean;
        };
    }>;
    updateCartItemQuantity: (userId: string, medicineId: string, quantity: number) => Promise<{
        medicine: {
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
                };
                shopName: string;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            categoryId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stock: number;
            manufacturer: string;
            imageUrl: string | null;
            isFeatured: boolean;
            dosageForm: string | null;
            sellerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        medicineId: string;
        quantity: number;
    }>;
    removeFromCart: (userId: string, medicineId: string) => Promise<{
        message: string;
    }>;
    clearCart: (userId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=cartItem.service.d.ts.map