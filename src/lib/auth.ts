import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "../app/utils/email";
import { USER_ROLE } from "../types/role";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
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
      // callbackUrl: process.env.GOOGLE_CALLBACK_URL as string, mapProfileToUser: ()=>{
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
  trustedOrigins: [process.env.APP_URL!, process.env.BETTER_AUTH_URL!],
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
          console.log(`User with email ${email} is an admin. Skipping sending verification OTP (${type}).`);
          return;
        }

        if (type === "email-verification" && user) {
          if (!user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password" && user) {
          await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            templateName: "otp",
            templateData: {
              name: user.name,
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
