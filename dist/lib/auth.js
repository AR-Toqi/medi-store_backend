"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const plugins_1 = require("better-auth/plugins");
const prisma_2 = require("./prisma");
const email_1 = require("../app/utils/email");
const role_1 = require("../types/role");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [process.env.APP_URL],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false,
            },
            isBanned: {
                type: "boolean",
                defaultValue: false,
                required: false,
            },
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },
    plugins: [
        (0, plugins_1.bearer)(),
        (0, plugins_1.emailOTP)({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma_2.prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });
                    // Admin check: Skip sending verification OTP for ADMIN role
                    if (user && user.role === role_1.USER_ROLE.ADMIN) {
                        console.log(`User with email ${email} is an admin. Skipping sending verification OTP.`);
                        return;
                    }
                    if (user && !user.emailVerified) {
                        await (0, email_1.sendEmail)({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            },
                        });
                    }
                }
                else if (type === "forget-password") {
                    const user = await prisma_2.prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });
                    if (user) {
                        await (0, email_1.sendEmail)({
                            to: email,
                            subject: "Password Reset OTP",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            },
                        });
                    }
                }
            },
            expiresIn: 2 * 60, // 2 minutes in seconds
            otpLength: 6,
        }),
    ],
});
//# sourceMappingURL=auth.js.map