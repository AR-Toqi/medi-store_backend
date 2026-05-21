import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma.js";
import { sendEmail } from "../app/utils/email.js";
import { USER_ROLE } from "../types/role.js";

console.log('Starting auth initialization...');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: () => {
        return {
          role: USER_ROLE.CUSTOMER,
          isBanned: false,
          needPasswordChange: false,
          emailVerified: true,
        }
      }
    }
  },
  trustedOrigins: [
    process.env.APP_URL,
    process.env.BETTER_AUTH_URL,
    "http://localhost:3000",
  ].filter((url): url is string => Boolean(url)),
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        }
      }
    }
  },
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
      needsPasswordChange: {
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
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }: { email: string, otp: string, type: "email-verification" | "forget-password" | "sign-in" | "change-email" }) {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        // Skip sending verification OTP for ADMIN role for auth-related types
        if (user && user.role === USER_ROLE.ADMIN && (type === "email-verification" || type === "sign-in")) {
          return;
        }

        if (type === "email-verification") {
          if (!user || !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user?.name || "User",
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            templateName: "otp",
            templateData: {
              name: user?.name || "User",
              otp,
            },
          });
        }
      },
      expiresIn: 2 * 60, // 2 minutes in seconds
      otpLength: 6,
    }),
  ],
});


console.log('Auth initialized successfully');