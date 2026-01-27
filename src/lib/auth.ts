import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from "../../generated/prisma/client";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
    enabled: true, 
  }, 
  trustedOrigins: [
    process.env.APP_URL!
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
    },
  },
});