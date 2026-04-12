"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const token_utils_1 = require("../../utils/token.utils");
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
const auth_1 = require("../../lib/auth");
const signUp = async (payload) => {
    const { email, password, name, role } = payload;
    const userExists = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (userExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
    }
    // Delegate user creation and OTP generation directly to Better Auth
    // @ts-ignore - explicitly passing programmatic body
    const result = await auth_1.auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
            role
        }
    });
    return result.user;
};
const signIn = async (payload) => {
    const { email, password } = payload;
    const session = await auth_1.auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    if (!session.user.emailVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Email not verified");
    }
    if (session.user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is banned");
    }
    const user = session.user;
    if (user.isBanned) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is banned");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, token_utils_1.generateAccessToken)(jwtPayload, process.env.BETTER_AUTH_SECRET, "1h");
    const refreshToken = (0, token_utils_1.generateRefreshToken)(jwtPayload, process.env.BETTER_AUTH_SECRET, "7d");
    return {
        user,
        accessToken,
        refreshToken,
        requiresVerification: !user.emailVerified
    };
};
const verifyEmail = async (payload) => {
    const otpCode = payload.otp || payload.code;
    if (!otpCode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Verification code is required");
    }
    const result = await auth_1.auth.api.verifyEmailOTP({
        body: {
            email: payload.email,
            otp: otpCode,
        }
    });
    if (result.user && result.user.emailVerified) {
        await prisma_1.prisma.user.update({
            where: {
                id: result.user.id,
            },
            data: {
                emailVerified: true,
            }
        });
        return await prisma_1.prisma.user.findUnique({
            where: { id: result.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
            }
        });
    }
    return result.user;
};
exports.authService = {
    signUp,
    signIn,
    verifyEmail,
};
//# sourceMappingURL=auth.service.js.map