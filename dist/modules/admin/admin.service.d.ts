export declare const adminService: {
    getAllUsers: () => Promise<{
        name: string;
        role: string | null;
        isBanned: boolean | null;
        email: string;
        id: string;
        createdAt: Date;
        sellerProfile: {
            id: string;
            shopName: string;
            isVerified: boolean;
        } | null;
    }[]>;
    updateUserStatus: (id: string, isBanned: boolean) => Promise<{
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
    }>;
    getAllSellers: () => Promise<({
        user: {
            name: string;
            isBanned: boolean | null;
            email: string;
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
    deleteUser: (id: string) => Promise<void>;
    deleteSeller: (id: string) => Promise<void>;
};
//# sourceMappingURL=admin.service.d.ts.map