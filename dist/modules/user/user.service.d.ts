export declare const userService: {
    getAllUsers: () => Promise<{
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
    }[]>;
    getCurrentUser: (userid: string) => Promise<{
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
    updateUser: (userId: string, payload: any) => Promise<{
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
    deleteUser: (userId: string) => Promise<{
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
};
//# sourceMappingURL=user.service.d.ts.map