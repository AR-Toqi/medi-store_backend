export declare const authService: {
    signUp: (payload: any) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        role: string | null | undefined;
        isBanned: boolean | null | undefined;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
        role: string | null | undefined;
        isBanned: boolean | null | undefined;
    }>;
    signIn: (payload: any) => Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
            role: string | null | undefined;
            isBanned: boolean | null | undefined;
        };
        accessToken: string;
        refreshToken: string;
        requiresVerification: boolean;
    }>;
    verifyEmail: (payload: {
        email: string;
        otp?: string;
        code?: string;
    }) => Promise<({
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
    } & Record<string, any>) | {
        name: string;
        role: string | null;
        email: string;
        id: string;
        emailVerified: boolean;
    } | null>;
};
//# sourceMappingURL=auth.service.d.ts.map