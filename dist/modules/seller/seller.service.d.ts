export declare const sellerService: {
    getSellerProfileByUserId: (userId: string) => Promise<{
        user: {
            name: string;
            email: string;
            image: string | null;
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
    getDashboardStats: (sellerId: string) => Promise<{
        totalMedicines: number;
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
    }>;
};
//# sourceMappingURL=seller.service.d.ts.map