import type { CreateSellerProfileInput, UpdateSellerProfileInput } from "../../types/sellerProfile.d";
export declare const createSellerProfile: (payload: CreateSellerProfileInput) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    shopName: string;
    shopDescription: string | null;
    shopLogo: string | null;
    licenseNumber: string | null;
    isVerified: boolean;
}>;
export declare const getSellerProfile: (userId: string) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    shopName: string;
    shopDescription: string | null;
    shopLogo: string | null;
    licenseNumber: string | null;
    isVerified: boolean;
}>;
export declare const updateSellerProfile: (userId: string, payload: UpdateSellerProfileInput) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    shopName: string;
    shopDescription: string | null;
    shopLogo: string | null;
    licenseNumber: string | null;
    isVerified: boolean;
}>;
export declare const deleteSellerProfile: (userId: string) => Promise<{
    message: string;
}>;
export declare const getAllSellers: () => Promise<({
    user: {
        name: string;
        role: string | null;
        email: string;
        id: string;
    };
    _count: {
        medicines: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    shopName: string;
    shopDescription: string | null;
    shopLogo: string | null;
    licenseNumber: string | null;
    isVerified: boolean;
})[]>;
export declare const sellerProfileService: {
    createSellerProfile: (payload: CreateSellerProfileInput) => Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopName: string;
        shopDescription: string | null;
        shopLogo: string | null;
        licenseNumber: string | null;
        isVerified: boolean;
    }>;
    getSellerProfile: (userId: string) => Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopName: string;
        shopDescription: string | null;
        shopLogo: string | null;
        licenseNumber: string | null;
        isVerified: boolean;
    }>;
    updateSellerProfile: (userId: string, payload: UpdateSellerProfileInput) => Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopName: string;
        shopDescription: string | null;
        shopLogo: string | null;
        licenseNumber: string | null;
        isVerified: boolean;
    }>;
    deleteSellerProfile: (userId: string) => Promise<{
        message: string;
    }>;
    getAllSellers: () => Promise<({
        user: {
            name: string;
            role: string | null;
            email: string;
            id: string;
        };
        _count: {
            medicines: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopName: string;
        shopDescription: string | null;
        shopLogo: string | null;
        licenseNumber: string | null;
        isVerified: boolean;
    })[]>;
};
//# sourceMappingURL=sellerProfile.service.d.ts.map