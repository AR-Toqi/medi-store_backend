var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [],
      "clientVersion": "7.3.0",
      "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
      "activeProvider": "postgresql",
      "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  ADMIN\n  SELLER\n  CUSTOMER\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  name      String\n  email     String     @unique\n  orders    Order[]    @relation("CustomerOrders")\n  reviews   Review[]\n  cartItems CartItem[]\n  addresses Address[]\n\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  emailVerified Boolean        @default(false)\n  image         String?\n  sessions      Session[]\n  accounts      Account[]\n  sellerProfile SellerProfile?\n  role          String?        @default("CUSTOMER")\n  isBanned      Boolean?       @default(false)\n\n  @@map("User")\n}\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String\n  slug        String     @unique\n  isActive    Boolean    @default(true)\n  description String?\n  image       String?\n  medicines   Medicine[]\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n}\n\nmodel Medicine {\n  id           String  @id @default(uuid())\n  name         String\n  slug         String\n  description  String\n  price        Decimal @db.Decimal(10, 2)\n  stock        Int\n  manufacturer String\n  imageUrl     String?\n  isFeatured   Boolean @default(false)\n  dosageForm   String?\n\n  categoryId String\n  sellerId   String\n\n  category Category      @relation(fields: [categoryId], references: [id])\n  seller   SellerProfile @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n\n  reviews    Review[]\n  orderItems OrderItem[]\n  cartItems  CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel SellerProfile {\n  id              String  @id @default(uuid())\n  userId          String  @unique\n  shopName        String\n  shopDescription String?\n  shopLogo        String?\n  licenseNumber   String? @unique\n  isVerified      Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  medicines Medicine[]\n\n  @@index([userId])\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  customerId      String\n  status          OrderStatus @default(PENDING)\n  totalAmount     Float\n  shippingAddress String\n  paymentMethod   String      @default("COD")\n\n  customer User        @relation("CustomerOrders", fields: [customerId], references: [id])\n  items    OrderItem[]\n\n  createdAt DateTime @default(now())\n}\n\nmodel OrderItem {\n  id         String @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Float\n\n  order    Order    @relation(fields: [orderId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n}\n\nmodel Review {\n  id      String @id @default(uuid())\n  rating  Int\n  comment String\n\n  userId     String\n  medicineId String\n\n  user     User     @relation(fields: [userId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel CartItem {\n  id         String @id @default(uuid())\n  userId     String\n  medicineId String\n  quantity   Int    @default(1)\n\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  medicine Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n  @@index([userId])\n}\n\nmodel Address {\n  id          String  @id @default(uuid())\n  userId      String\n  fullName    String\n  phone       String\n  country     String?\n  city        String\n  state       String\n  area        String?\n  postalCode  String\n  addressLine String\n  label       String?\n  isDefault   Boolean @default(false)\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"sellerProfile","kind":"object","type":"SellerProfile","relationName":"SellerProfileToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"isBanned","kind":"scalar","type":"Boolean"}],"dbName":"User"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"dosageForm","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"seller","kind":"object","type":"SellerProfile","relationName":"MedicineToSellerProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"SellerProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"shopName","kind":"scalar","type":"String"},{"name":"shopDescription","kind":"scalar","type":"String"},{"name":"shopLogo","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SellerProfileToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToSellerProfile"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"CartItemToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartItemToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"addressLine","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext, NullTypes2, TransactionIsolationLevel, defineExtension;
var init_prismaNamespace = __esm({
  "generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// generated/prisma/enums.ts
var Role, OrderStatus;
var init_enums = __esm({
  "generated/prisma/enums.ts"() {
    "use strict";
    Role = {
      ADMIN: "ADMIN",
      SELLER: "SELLER",
      CUSTOMER: "CUSTOMER"
    };
    OrderStatus = {
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      SHIPPED: "SHIPPED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED"
    };
  }
});

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, adapter, prisma;
var init_prisma = __esm({
  "src/lib/prisma.ts"() {
    "use strict";
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  }
});

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter, auth;
var init_auth = __esm({
  "src/lib/auth.ts"() {
    "use strict";
    init_prisma();
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      // Use true for port 465, false for port 587
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
      }
    });
    auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql"
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
      },
      trustedOrigins: [
        process.env.APP_URL
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
          }
        }
      },
      emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }) => {
          try {
            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">

        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#111827;">MediStore \u{1F48A}</h1>
              <p style="margin:4px 0 0; color:#6b7280;">Your Trusted Online Medicine Shop</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="color:#374151; font-size:16px; line-height:1.6;">
              <p>Hello \u{1F44B} ${user.name}</p>

              <p>
                Thank you for signing up for <strong>MediStore</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <p style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                   style="
                     background-color:#16a34a;
                     color:#ffffff;
                     padding:12px 24px;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:bold;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </p>

              <p>
                If the button doesn\u2019t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; color:#2563eb;">
                ${verificationUrl}
              </p>

              <p>
                If you didn\u2019t create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:30px; text-align:center; font-size:12px; color:#9ca3af;">
              <p style="margin:0;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} MediStore. All rights reserved.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
            const info = await transporter.sendMail({
              from: '"Your APP" <${process.env.APP_USER}>',
              to: user.email,
              subject: "Plz verify your email !",
              text: "Hello world?",
              // Plain-text version of the message
              html
              // HTML version of the message
            });
            console.log(" Verification email sent successfully:", info.messageId);
          } catch (error) {
            console.error(" Failed to send verification email:", error);
            throw error;
          }
        }
      }
    });
  }
});

// src/middlewares/auth.middleware.ts
var requireAuth;
var init_auth_middleware = __esm({
  "src/middlewares/auth.middleware.ts"() {
    "use strict";
    init_auth();
    requireAuth = async (req, res, next) => {
      try {
        const session = await auth.api.getSession({
          headers: req.headers
        });
        if (!session || !session.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (!session.user.emailVerified) {
          return res.status(403).json({
            success: false,
            message: "Email verification required. Please verfiy your email!"
          });
        }
        if (session.user.isBanned) {
          return res.status(403).json({ message: "User is banned" });
        }
        req.user = {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          isBanned: session.user.isBanned
        };
        next();
      } catch (error) {
      }
    };
  }
});

// src/middlewares/roleGuard.middleware.ts
var roleGuard;
var init_roleGuard_middleware = __esm({
  "src/middlewares/roleGuard.middleware.ts"() {
    "use strict";
    roleGuard = (...roles) => (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions"
        });
      }
      next();
    };
  }
});

// src/modules/user/user.service.ts
var getAllUsers, getCurrentUser, updateUser, deleteUser, userService;
var init_user_service = __esm({
  "src/modules/user/user.service.ts"() {
    "use strict";
    init_prisma();
    getAllUsers = async () => {
      const users = await prisma.user.findMany();
      return users;
    };
    getCurrentUser = async (userid) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userid
        }
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    };
    updateUser = async (userId, payload) => {
      const result = await prisma.user.update({
        where: { id: userId },
        data: payload
      });
      return result;
    };
    deleteUser = async (userId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      return await prisma.user.delete({ where: { id: userId } });
    };
    userService = {
      getAllUsers,
      getCurrentUser,
      updateUser,
      deleteUser
    };
  }
});

// src/modules/user/user.controller.ts
var getAllUsers2, getCurrentUser2, updateUser2, deleteUser2, userController;
var init_user_controller = __esm({
  "src/modules/user/user.controller.ts"() {
    "use strict";
    init_user_service();
    getAllUsers2 = async (req, res) => {
      try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
          success: true,
          message: "Users fetched successfully",
          data: users
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch users"
        });
      }
    };
    getCurrentUser2 = async (req, res) => {
      try {
        const id = req.user?.id;
        const user = await userService.getCurrentUser(id);
        return res.status(200).json({
          success: true,
          message: "User fetched successfully",
          data: user
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "User not found"
        });
      }
    };
    updateUser2 = async (req, res) => {
      try {
        const userId = req.user.id;
        const payload = req.body;
        const updatedUser = await userService.updateUser(userId, payload);
        return res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: updatedUser
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update user"
        });
      }
    };
    deleteUser2 = async (req, res) => {
      try {
        const userId = req.params.id;
        console.log(userId);
        await userService.deleteUser(userId);
        return res.status(200).json({
          success: true,
          message: "User deleted successfully"
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Failed to delete user"
        });
      }
    };
    userController = {
      getAllUsers: getAllUsers2,
      getCurrentUser: getCurrentUser2,
      updateUser: updateUser2,
      deleteUser: deleteUser2
    };
  }
});

// src/types/role.ts
var init_role = __esm({
  "src/types/role.ts"() {
    "use strict";
  }
});

// src/modules/user/user.router.ts
import { Router } from "express";
var router, userRoutes;
var init_user_router = __esm({
  "src/modules/user/user.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_roleGuard_middleware();
    init_user_controller();
    init_role();
    router = Router();
    router.get("/", requireAuth, userController.getCurrentUser);
    router.put("/me", requireAuth, userController.updateUser);
    router.get("/admin/users", requireAuth, roleGuard("ADMIN" /* ADMIN */), userController.getAllUsers);
    router.delete("/admin/:id", requireAuth, roleGuard("ADMIN" /* ADMIN */), userController.deleteUser);
    userRoutes = router;
  }
});

// src/utils/slugify.ts
function slugify(text) {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+|-+$/g, "");
}
var init_slugify = __esm({
  "src/utils/slugify.ts"() {
    "use strict";
  }
});

// src/modules/categories/categories.service.ts
var createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory, categoryService;
var init_categories_service = __esm({
  "src/modules/categories/categories.service.ts"() {
    "use strict";
    init_prisma();
    init_slugify();
    createCategory = async (payload) => {
      try {
        const slug = slugify(payload.name);
        const existingCategory = await prisma.category.findFirst({
          where: {
            OR: [
              { name: payload.name },
              { slug }
            ]
          }
        });
        if (existingCategory) {
          throw new Error("Category already exists");
        }
        return await prisma.category.create({
          data: {
            name: payload.name,
            slug
          }
        });
      } catch (error) {
        throw new Error(error.message || "Failed to create category");
      }
    };
    getAllCategories = async () => {
      try {
        return await prisma.category.findMany({
          where: { isActive: true },
          orderBy: { createdAt: "desc" }
        });
      } catch {
        throw new Error("Failed to fetch categories");
      }
    };
    getSingleCategory = async (id) => {
      try {
        const category = await prisma.category.findUnique({
          where: { id }
        });
        if (!category) {
          throw new Error("Category not found");
        }
        return category;
      } catch (error) {
        throw new Error(error.message || "Failed to fetch category");
      }
    };
    updateCategory = async (id, payload) => {
      try {
        const category = await prisma.category.findUnique({
          where: { id }
        });
        if (!category) {
          throw new Error("Category not found");
        }
        let updateData = { ...payload };
        if (payload.name) {
          const newSlug = slugify(payload.name);
          const slugExists = await prisma.category.findFirst({
            where: {
              slug: newSlug,
              NOT: { id }
            }
          });
          if (slugExists) {
            throw new Error("Category with this name already exists");
          }
          updateData.slug = newSlug;
        }
        return await prisma.category.update({
          where: { id },
          data: updateData
        });
      } catch (error) {
        throw new Error(error.message || "Failed to update category");
      }
    };
    deleteCategory = async (id) => {
      try {
        const category = await prisma.category.findUnique({
          where: { id }
        });
        if (!category) {
          throw new Error("Category not found");
        }
        const medicineCount = await prisma.medicine.count({
          where: { categoryId: id }
        });
        if (medicineCount > 0) {
          throw new Error(
            "Cannot delete category because medicines exist under this category"
          );
        }
        return await prisma.category.delete({
          where: { id }
        });
      } catch (error) {
        throw new Error(error.message || "Failed to delete category");
      }
    };
    categoryService = {
      createCategory,
      getAllCategories,
      getSingleCategory,
      updateCategory,
      deleteCategory
    };
  }
});

// src/modules/categories/categories.controller.ts
var createCategory2, getAllCategories2, getSingleCategory2, updateCategory2, deleteCategory2, categoryController;
var init_categories_controller = __esm({
  "src/modules/categories/categories.controller.ts"() {
    "use strict";
    init_role();
    init_categories_service();
    createCategory2 = async (req, res) => {
      try {
        if (req.user?.role !== "ADMIN" /* ADMIN */) {
          return res.status(403).json({ message: "Access denied" });
        }
        const result = await categoryService.createCategory(req.body);
        return res.status(201).json({
          success: true,
          data: result
        });
      } catch (error) {
        return res.status(409).json({
          success: false,
          message: error.message || "Failed to create category"
        });
      }
    };
    getAllCategories2 = async (_req, res) => {
      try {
        const result = await categoryService.getAllCategories();
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch categories"
        });
      }
    };
    getSingleCategory2 = async (req, res) => {
      try {
        const result = await categoryService.getSingleCategory(req.params.id);
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Category not found"
        });
      }
    };
    updateCategory2 = async (req, res) => {
      try {
        if (req.user?.role !== "ADMIN" /* ADMIN */) {
          return res.status(403).json({ message: "Access denied" });
        }
        const result = await categoryService.updateCategory(
          req.params.id,
          req.body
        );
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update category"
        });
      }
    };
    deleteCategory2 = async (req, res) => {
      try {
        if (req.user?.role !== "ADMIN" /* ADMIN */) {
          return res.status(403).json({ message: "Access denied" });
        }
        await categoryService.deleteCategory(req.params.id);
        return res.status(200).json({
          success: true,
          message: "Category deleted successfully"
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to delete category"
        });
      }
    };
    categoryController = {
      createCategory: createCategory2,
      getAllCategories: getAllCategories2,
      getSingleCategory: getSingleCategory2,
      updateCategory: updateCategory2,
      deleteCategory: deleteCategory2
    };
  }
});

// src/modules/categories/categories.router.ts
import { Router as Router2 } from "express";
var router2, categoryRoutes;
var init_categories_router = __esm({
  "src/modules/categories/categories.router.ts"() {
    "use strict";
    init_categories_controller();
    router2 = Router2();
    router2.get("/categories", categoryController.getAllCategories);
    router2.get("/categories/:id", categoryController.getSingleCategory);
    categoryRoutes = router2;
  }
});

// src/modules/sellerProfile/sellerProfile.service.ts
var createSellerProfile, getSellerProfile, updateSellerProfile, deleteSellerProfile, getAllSellers, sellerProfileService;
var init_sellerProfile_service = __esm({
  "src/modules/sellerProfile/sellerProfile.service.ts"() {
    "use strict";
    init_prisma();
    createSellerProfile = async (payload) => {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId: payload.userId }
      });
      if (existingProfile) {
        throw new Error("Seller profile already exists for this user");
      }
      const sellerProfile = await prisma.sellerProfile.create({
        data: {
          userId: payload.userId,
          shopName: payload.shopName,
          ...payload.shopDescription && { shopDescription: payload.shopDescription },
          ...payload.licenseNumber && { licenseNumber: payload.licenseNumber }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      return sellerProfile;
    };
    getSellerProfile = async (userId) => {
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      if (!sellerProfile) {
        throw new Error("Seller profile not found");
      }
      return sellerProfile;
    };
    updateSellerProfile = async (userId, payload) => {
      const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId }
      });
      if (!existingProfile) {
        throw new Error("Seller profile not found");
      }
      const updatedProfile = await prisma.sellerProfile.update({
        where: { userId },
        data: {
          ...payload.shopName && { shopName: payload.shopName },
          ...payload.shopDescription !== void 0 && { shopDescription: payload.shopDescription },
          ...payload.shopLogo !== void 0 && { shopLogo: payload.shopLogo },
          ...payload.licenseNumber !== void 0 && { licenseNumber: payload.licenseNumber }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      return updatedProfile;
    };
    deleteSellerProfile = async (userId) => {
      const existingProfile = await prisma.sellerProfile.findUnique({
        where: { userId }
      });
      if (!existingProfile) {
        throw new Error("Seller profile not found");
      }
      await prisma.sellerProfile.delete({
        where: { userId }
      });
      return { message: "Seller profile deleted successfully" };
    };
    getAllSellers = async () => {
      const sellers = await prisma.sellerProfile.findMany({
        orderBy: {
          createdAt: "desc"
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              medicines: true
            }
          }
        }
      });
      return sellers;
    };
    sellerProfileService = {
      createSellerProfile,
      getSellerProfile,
      updateSellerProfile,
      deleteSellerProfile,
      getAllSellers
    };
  }
});

// src/modules/sellerProfile/sellerProfile.controller.ts
var createSellerProfile2, getSellerProfile2, updateSellerProfile2, deleteSellerProfile2, getAllSellers2, sellerProfileController;
var init_sellerProfile_controller = __esm({
  "src/modules/sellerProfile/sellerProfile.controller.ts"() {
    "use strict";
    init_sellerProfile_service();
    createSellerProfile2 = async (req, res) => {
      try {
        const payload = req.body;
        const userId = req.user?.id;
        const sellerProfileData = {
          ...payload,
          userId
        };
        const sellerProfile = await sellerProfileService.createSellerProfile(sellerProfileData);
        return res.status(201).json({
          success: true,
          message: "Seller profile created successfully",
          data: sellerProfile
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create seller profile"
        });
      }
    };
    getSellerProfile2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const sellerProfile = await sellerProfileService.getSellerProfile(userId);
        return res.status(200).json({
          success: true,
          message: "Seller profile fetched successfully",
          data: sellerProfile
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Seller profile not found"
        });
      }
    };
    updateSellerProfile2 = async (req, res) => {
      try {
        const payload = req.body;
        const userId = req.user?.id;
        const updatedProfile = await sellerProfileService.updateSellerProfile(userId, payload);
        return res.status(200).json({
          success: true,
          message: "Seller profile updated successfully",
          data: updatedProfile
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update seller profile"
        });
      }
    };
    deleteSellerProfile2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const result = await sellerProfileService.deleteSellerProfile(userId);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to delete seller profile"
        });
      }
    };
    getAllSellers2 = async (req, res) => {
      try {
        const sellers = await sellerProfileService.getAllSellers();
        return res.status(200).json({
          success: true,
          message: "Sellers fetched successfully",
          data: sellers
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch sellers"
        });
      }
    };
    sellerProfileController = {
      createSellerProfile: createSellerProfile2,
      getSellerProfile: getSellerProfile2,
      updateSellerProfile: updateSellerProfile2,
      deleteSellerProfile: deleteSellerProfile2,
      getAllSellers: getAllSellers2
    };
  }
});

// src/modules/sellerProfile/sellerProfile.router.ts
import { Router as Router3 } from "express";
var router3, sellerProfileRoutes;
var init_sellerProfile_router = __esm({
  "src/modules/sellerProfile/sellerProfile.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_roleGuard_middleware();
    init_sellerProfile_controller();
    init_role();
    router3 = Router3();
    router3.post("/", requireAuth, sellerProfileController.createSellerProfile);
    router3.get("/", requireAuth, roleGuard("SELLER" /* SELLER */), sellerProfileController.getSellerProfile);
    router3.put("/", requireAuth, roleGuard("SELLER" /* SELLER */), sellerProfileController.updateSellerProfile);
    router3.delete("/", requireAuth, roleGuard("SELLER" /* SELLER */), sellerProfileController.deleteSellerProfile);
    sellerProfileRoutes = router3;
  }
});

// src/modules/medicine/medicine.service.ts
var createMedicine, getAllMedicines, updateMedicine, deleteMedicine, getMedicineDetails, createMedicineForSeller, getMedicinesBySeller, updateMedicineBySeller, deleteMedicineBySeller, getMedicineDetailsBySeller, medicineService;
var init_medicine_service = __esm({
  "src/modules/medicine/medicine.service.ts"() {
    "use strict";
    init_prisma();
    init_slugify();
    createMedicine = async (payload) => {
      const category = await prisma.category.findUnique({
        where: { id: payload.categoryId }
      });
      if (!category) {
        throw new Error("Category not found");
      }
      const baseSlug = slugify(payload.name);
      if (!baseSlug) {
        throw new Error("Invalid medicine name for slug generation");
      }
      let slug = baseSlug;
      let count = 1;
      while (await prisma.medicine.findFirst({
        where: { slug }
      })) {
        slug = `${baseSlug}-${count++}`;
      }
      const medicine = await prisma.medicine.create({
        data: {
          name: payload.name,
          slug,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          manufacturer: payload.manufacturer || "Unknown",
          categoryId: payload.categoryId,
          sellerId: payload.sellerId || ""
          // Will be updated by controller/middleware
        },
        include: {
          category: true
        }
      });
      return medicine;
    };
    getAllMedicines = async (params) => {
      const page = params.page && params.page > 0 ? params.page : 1;
      const limit = params.limit && params.limit > 0 ? params.limit : 10;
      const search = params.search?.trim() || "";
      const skip = (page - 1) * limit;
      const whereCondition = search ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive"
              // case-insensitive search
            }
          },
          {
            description: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      } : {};
      const total = await prisma.medicine.count({
        where: whereCondition
      });
      const medicines = await prisma.medicine.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
          // newest first
        },
        include: {
          category: true
          // if you have relation with category
        }
      });
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: medicines
      };
    };
    updateMedicine = async (id, payload) => {
      const medicine = await prisma.medicine.findUnique({
        where: { id }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      if (payload.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: payload.categoryId }
        });
        if (!category) {
          throw new Error("Category not found");
        }
      }
      let slug = medicine.slug;
      if (payload.name) {
        const baseSlug = slugify(payload.name);
        if (!baseSlug) {
          throw new Error("Invalid medicine name for slug generation");
        }
        slug = baseSlug;
        let count = 1;
        while (await prisma.medicine.findFirst({
          where: { slug, id: { not: id } }
        })) {
          slug = `${baseSlug}-${count++}`;
        }
      }
      const updatedMedicine = await prisma.medicine.update({
        where: { id },
        data: {
          ...payload.name && { name: payload.name },
          ...payload.name && { slug },
          ...payload.description && { description: payload.description },
          ...payload.price && { price: payload.price },
          ...payload.stock !== void 0 && { stock: payload.stock },
          ...payload.manufacturer && { manufacturer: payload.manufacturer },
          ...payload.dosage && { dosageForm: payload.dosage },
          ...payload.categoryId && { categoryId: payload.categoryId }
        },
        include: {
          category: true
        }
      });
      return updatedMedicine;
    };
    deleteMedicine = async (id) => {
      const medicine = await prisma.medicine.findUnique({
        where: { id }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      await prisma.medicine.delete({
        where: { id }
      });
      return { message: "Medicine deleted successfully" };
    };
    getMedicineDetails = async (slug) => {
      const medicine = await prisma.medicine.findFirst({
        where: { slug },
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          seller: {
            select: {
              id: true,
              shopName: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      return medicine;
    };
    createMedicineForSeller = async (sellerId, payload) => {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId }
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      const category = await prisma.category.findUnique({
        where: { id: payload.categoryId }
      });
      if (!category) {
        throw new Error("Category not found");
      }
      const baseSlug = slugify(payload.name);
      if (!baseSlug) {
        throw new Error("Invalid medicine name for slug generation");
      }
      let slug = baseSlug;
      let count = 1;
      while (await prisma.medicine.findFirst({
        where: { slug }
      })) {
        slug = `${baseSlug}-${count++}`;
      }
      const medicine = await prisma.medicine.create({
        data: {
          name: payload.name,
          slug,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          manufacturer: payload.manufacturer || "Unknown",
          categoryId: payload.categoryId,
          sellerId
        },
        include: {
          category: true
        }
      });
      return medicine;
    };
    getMedicinesBySeller = async (sellerId, params) => {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId }
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      const page = params.page && params.page > 0 ? params.page : 1;
      const limit = params.limit && params.limit > 0 ? params.limit : 10;
      const search = params.search?.trim() || "";
      const skip = (page - 1) * limit;
      const whereCondition = {
        sellerId,
        ...search ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              description: {
                contains: search,
                mode: "insensitive"
              }
            }
          ]
        } : {}
      };
      const total = await prisma.medicine.count({
        where: whereCondition
      });
      const medicines = await prisma.medicine.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          category: true
        }
      });
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: medicines
      };
    };
    updateMedicineBySeller = async (sellerId, medicineId, payload) => {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      if (medicine.sellerId !== sellerId) {
        throw new Error("Unauthorized: You can only update your own medicines");
      }
      if (payload.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: payload.categoryId }
        });
        if (!category) {
          throw new Error("Category not found");
        }
      }
      let slug = medicine.slug;
      if (payload.name) {
        const baseSlug = slugify(payload.name);
        if (!baseSlug) {
          throw new Error("Invalid medicine name for slug generation");
        }
        slug = baseSlug;
        let count = 1;
        while (await prisma.medicine.findFirst({
          where: { slug, id: { not: medicineId } }
        })) {
          slug = `${baseSlug}-${count++}`;
        }
      }
      const updatedMedicine = await prisma.medicine.update({
        where: { id: medicineId },
        data: {
          ...payload.name && { name: payload.name },
          ...payload.name && { slug },
          ...payload.description && { description: payload.description },
          ...payload.price && { price: payload.price },
          ...payload.stock !== void 0 && { stock: payload.stock },
          ...payload.manufacturer && { manufacturer: payload.manufacturer },
          ...payload.dosage && { dosageForm: payload.dosage },
          ...payload.categoryId && { categoryId: payload.categoryId }
        },
        include: {
          category: true
        }
      });
      return updatedMedicine;
    };
    deleteMedicineBySeller = async (sellerId, medicineId) => {
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      if (medicine.sellerId !== sellerId) {
        throw new Error("Unauthorized: You can only delete your own medicines");
      }
      await prisma.medicine.delete({
        where: { id: medicineId }
      });
      return { message: "Medicine deleted successfully" };
    };
    getMedicineDetailsBySeller = async (sellerId, slug) => {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId }
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      const medicine = await prisma.medicine.findFirst({
        where: { slug, sellerId },
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      return medicine;
    };
    medicineService = {
      createMedicine,
      getAllMedicines,
      updateMedicine,
      deleteMedicine,
      getMedicineDetails,
      // Seller-specific functions with validation
      createMedicineForSeller,
      getMedicinesBySeller,
      updateMedicineBySeller,
      deleteMedicineBySeller,
      getMedicineDetailsBySeller
    };
  }
});

// src/modules/medicine/medicine.controller.ts
var createMedicine2, getAllMedicines2, getMedicinesBySeller2, getMedicineDetails2, getMedicineDetailsBySeller2, updateMedicine2, deleteMedicine2, medicineController;
var init_medicine_controller = __esm({
  "src/modules/medicine/medicine.controller.ts"() {
    "use strict";
    init_medicine_service();
    createMedicine2 = async (req, res) => {
      try {
        const payload = req.body;
        const sellerId = req.user?.id;
        const medicine = await medicineService.createMedicineForSeller(sellerId, payload);
        return res.status(201).json({
          success: true,
          message: "Medicine created successfully",
          data: medicine
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create medicine"
        });
      }
    };
    getAllMedicines2 = async (req, res) => {
      try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const search = req.query.search;
        const result = await medicineService.getAllMedicines({
          page,
          limit,
          ...search && { search }
        });
        return res.status(200).json({
          success: true,
          message: "Medicines fetched successfully",
          data: result.data,
          meta: result.meta
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch medicines"
        });
      }
    };
    getMedicinesBySeller2 = async (req, res) => {
      try {
        const sellerId = req.user?.id;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const search = req.query.search;
        const result = await medicineService.getMedicinesBySeller(sellerId, {
          page,
          limit,
          ...search && { search }
        });
        return res.status(200).json({
          success: true,
          message: "Your medicines fetched successfully",
          data: result.data,
          meta: result.meta
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch medicines"
        });
      }
    };
    getMedicineDetails2 = async (req, res) => {
      try {
        const { slug } = req.params;
        const medicine = await medicineService.getMedicineDetails(slug);
        return res.status(200).json({
          success: true,
          message: "Medicine details fetched successfully",
          data: medicine
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Medicine not found"
        });
      }
    };
    getMedicineDetailsBySeller2 = async (req, res) => {
      try {
        const { slug } = req.params;
        const sellerId = req.user?.id;
        const medicine = await medicineService.getMedicineDetailsBySeller(sellerId, slug);
        return res.status(200).json({
          success: true,
          message: "Medicine details fetched successfully",
          data: medicine
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Medicine not found"
        });
      }
    };
    updateMedicine2 = async (req, res) => {
      try {
        const { id } = req.params;
        const payload = req.body;
        const sellerId = req.user?.id;
        const updatedMedicine = await medicineService.updateMedicineBySeller(sellerId, id, payload);
        return res.status(200).json({
          success: true,
          message: "Medicine updated successfully",
          data: updatedMedicine
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update medicine"
        });
      }
    };
    deleteMedicine2 = async (req, res) => {
      try {
        const { id } = req.params;
        const sellerId = req.user?.id;
        const result = await medicineService.deleteMedicineBySeller(sellerId, id);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Failed to delete medicine"
        });
      }
    };
    medicineController = {
      createMedicine: createMedicine2,
      getAllMedicines: getAllMedicines2,
      getMedicinesBySeller: getMedicinesBySeller2,
      getMedicineDetails: getMedicineDetails2,
      getMedicineDetailsBySeller: getMedicineDetailsBySeller2,
      updateMedicine: updateMedicine2,
      deleteMedicine: deleteMedicine2
    };
  }
});

// src/modules/medicine/medicine.router.ts
import { Router as Router4 } from "express";
var router4, medicineRoutes;
var init_medicine_router = __esm({
  "src/modules/medicine/medicine.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_roleGuard_middleware();
    init_medicine_controller();
    init_role();
    router4 = Router4();
    router4.get("/", medicineController.getAllMedicines);
    router4.get("/:slug", medicineController.getMedicineDetails);
    router4.post("/", requireAuth, roleGuard("SELLER" /* SELLER */), medicineController.createMedicine);
    router4.get("/dashboard", requireAuth, roleGuard("SELLER" /* SELLER */), medicineController.getMedicinesBySeller);
    router4.get("/dashboard/:slug", requireAuth, roleGuard("SELLER" /* SELLER */), medicineController.getMedicineDetailsBySeller);
    router4.put("/dashboard/:id", requireAuth, roleGuard("SELLER" /* SELLER */), medicineController.updateMedicine);
    router4.delete("/dashboard/:id", requireAuth, roleGuard("SELLER" /* SELLER */), medicineController.deleteMedicine);
    medicineRoutes = router4;
  }
});

// src/utils/email.ts
import nodemailer2 from "nodemailer";
async function sendMail(options) {
  await transporter2.sendMail({
    from: process.env.APP_USER || "no-reply@medistore.com",
    ...options
  });
}
var transporter2;
var init_email = __esm({
  "src/utils/email.ts"() {
    "use strict";
    transporter2 = nodemailer2.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
      }
    });
  }
});

// src/modules/order/order.service.ts
var formatAddressToString, createOrder, createOrderFromCart, getAllOrders, getOrdersBySeller, getOrderDetails, updateOrderStatus, getCustomerOrders, orderService;
var init_order_service = __esm({
  "src/modules/order/order.service.ts"() {
    "use strict";
    init_prisma();
    init_enums();
    init_email();
    formatAddressToString = (address) => {
      const parts = [
        address.fullName,
        address.addressLine
      ];
      if (address.area) parts.push(address.area);
      parts.push(address.city);
      parts.push(address.state);
      if (address.postalCode) parts.push(address.postalCode);
      if (address.country) parts.push(address.country);
      return parts.filter(Boolean).join(", ");
    };
    createOrder = async (payload) => {
      const customer = await prisma.user.findUnique({
        where: { id: payload.customerId }
      });
      if (!customer) {
        throw new Error("Customer not found");
      }
      let totalAmount = 0;
      const orderItems = [];
      for (const item of payload.items) {
        const medicine = await prisma.medicine.findUnique({
          where: { id: item.medicineId },
          include: { seller: true }
        });
        if (!medicine) {
          throw new Error(`Medicine with ID ${item.medicineId} not found`);
        }
        if (medicine.stock < item.quantity) {
          throw new Error(`Insufficient stock for medicine: ${medicine.name}`);
        }
        const itemTotal = Number(medicine.price) * item.quantity;
        totalAmount += itemTotal;
        orderItems.push({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: Number(medicine.price)
        });
      }
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            customerId: payload.customerId,
            totalAmount,
            shippingAddress: payload.shippingAddress,
            paymentMethod: payload.paymentMethod || "COD"
          }
        });
        await tx.orderItem.createMany({
          data: orderItems.map((item) => ({
            orderId: newOrder.id,
            ...item
          }))
        });
        for (const item of payload.items) {
          await tx.medicine.update({
            where: { id: item.medicineId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
        return newOrder;
      });
      const customerData = await prisma.user.findUnique({ where: { id: payload.customerId } });
      if (customerData?.email) {
        await sendMail({
          to: customerData.email,
          subject: "Order Placed Successfully",
          html: `<p>Dear ${customerData.name || "Customer"},</p><p>Your order (ID: ${order.id}) has been placed successfully. We will notify you as it progresses.</p>`
        });
      }
      return order;
    };
    createOrderFromCart = async (customerId, payload) => {
      const { addressId } = payload;
      const address = await prisma.address.findUnique({
        where: { id: addressId }
      });
      if (!address) {
        throw new Error("Address not found");
      }
      if (address.userId !== customerId) {
        throw new Error("Access denied. Address does not belong to you");
      }
      const shippingAddress = formatAddressToString(address);
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: customerId },
        include: { medicine: true }
      });
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }
      let totalAmount = 0;
      const orderItems = cartItems.map((ci) => {
        const med = ci.medicine;
        if (!med) {
          throw new Error(`Medicine not found for cart item ${ci.id}`);
        }
        if (med.stock < ci.quantity) {
          throw new Error(`Insufficient stock for medicine: ${med.name}`);
        }
        totalAmount += Number(med.price) * ci.quantity;
        return {
          medicineId: med.id,
          quantity: ci.quantity,
          price: Number(med.price)
        };
      });
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            customerId,
            totalAmount,
            shippingAddress,
            paymentMethod: payload.paymentMethod || "COD"
          }
        });
        await tx.orderItem.createMany({
          data: orderItems.map((it) => ({ orderId: newOrder.id, ...it }))
        });
        for (const ci of cartItems) {
          await tx.medicine.update({
            where: { id: ci.medicineId },
            data: { stock: { decrement: ci.quantity } }
          });
        }
        await tx.cartItem.deleteMany({ where: { userId: customerId } });
        return newOrder;
      });
      return order;
    };
    getAllOrders = async (params) => {
      const page = params.page && params.page > 0 ? params.page : 1;
      const limit = params.limit && params.limit > 0 ? params.limit : 10;
      const search = params.search?.trim() || "";
      const skip = (page - 1) * limit;
      const whereCondition = {};
      if (params.status) {
        whereCondition.status = params.status;
      }
      if (search) {
        whereCondition.OR = [
          {
            customer: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          },
          {
            customer: {
              email: {
                contains: search,
                mode: "insensitive"
              }
            }
          },
          {
            id: {
              contains: search
            }
          }
        ];
      }
      const total = await prisma.order.count({
        where: whereCondition
      });
      const orders = await prisma.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  seller: {
                    select: {
                      id: true,
                      shopName: true,
                      user: {
                        select: {
                          name: true,
                          email: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: orders
      };
    };
    getOrdersBySeller = async (sellerId, params) => {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: sellerId }
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      const page = params.page && params.page > 0 ? params.page : 1;
      const limit = params.limit && params.limit > 0 ? params.limit : 10;
      const search = params.search?.trim() || "";
      const skip = (page - 1) * limit;
      const whereCondition = {
        items: {
          some: {
            medicine: {
              sellerId
            }
          }
        }
      };
      if (params.status) {
        whereCondition.status = params.status;
      }
      if (search) {
        whereCondition.OR = [
          {
            customer: {
              name: {
                contains: search,
                mode: "insensitive"
              }
            }
          },
          {
            customer: {
              email: {
                contains: search,
                mode: "insensitive"
              }
            }
          },
          {
            id: {
              contains: search
            }
          }
        ];
      }
      const total = await prisma.order.count({
        where: whereCondition
      });
      const orders = await prisma.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  seller: {
                    select: {
                      id: true,
                      shopName: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: orders
      };
    };
    getOrderDetails = async (orderId) => {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  seller: {
                    select: {
                      id: true,
                      shopName: true,
                      user: {
                        select: {
                          name: true,
                          email: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    };
    updateOrderStatus = async (payload) => {
      const { orderId, status, userRole, userId } = payload;
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      if (!order) {
        throw new Error("Order not found");
      }
      const validStatuses = Object.values(OrderStatus);
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid order status");
      }
      if (userRole === Role.SELLER) {
        const orderWithItems = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: {
                medicine: true
              }
            }
          }
        });
        const hasSellerMedicines = orderWithItems?.items.some(
          (item) => item.medicine.sellerId === userId
        );
        if (!hasSellerMedicines) {
          throw new Error("You can only update orders containing your medicines");
        }
        const allowedStatuses = [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
        if (!allowedStatuses.includes(status)) {
          throw new Error("Sellers can only set status to CONFIRMED, SHIPPED, or DELIVERED");
        }
      }
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  seller: {
                    select: {
                      shopName: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      if (updatedOrder.customer?.email) {
        let subject = "Order Update";
        let html = `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) status is now <b>${status}</b>.</p>`;
        if (status === OrderStatus.SHIPPED) {
          subject = "Your Order Has Shipped";
          html = `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) has been <b>shipped</b> and is on its way!</p>`;
        } else if (status === OrderStatus.DELIVERED) {
          subject = "Order Delivered";
          html = `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) has been <b>delivered</b>. Thank you for shopping with us!</p>`;
        } else if (status === OrderStatus.CONFIRMED) {
          subject = "Order Confirmed";
          html = `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) has been <b>confirmed</b> and is being prepared.</p>`;
        } else if (status === OrderStatus.CANCELLED) {
          subject = "Order Cancelled";
          html = `<p>Dear ${updatedOrder.customer.name || "Customer"},</p><p>Your order (ID: ${updatedOrder.id}) has been <b>cancelled</b>. If you have questions, please contact support.</p>`;
        }
        await sendMail({
          to: updatedOrder.customer.email,
          subject,
          html
        });
      }
      return updatedOrder;
    };
    getCustomerOrders = async (customerId, params) => {
      const page = params.page && params.page > 0 ? params.page : 1;
      const limit = params.limit && params.limit > 0 ? params.limit : 10;
      const skip = (page - 1) * limit;
      const whereCondition = {
        customerId
      };
      if (params.status) {
        whereCondition.status = params.status;
      }
      const total = await prisma.order.count({
        where: whereCondition
      });
      const orders = await prisma.order.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        include: {
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      });
      return {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        data: orders
      };
    };
    orderService = {
      createOrder,
      createOrderFromCart,
      getAllOrders,
      getOrdersBySeller,
      getOrderDetails,
      updateOrderStatus,
      getCustomerOrders
    };
  }
});

// src/modules/order/order.controller.ts
var createOrder2, getMyOrders, getAllOrders2, getOrdersBySeller2, getOrderDetails2, updateOrderStatus2, checkout, orderController;
var init_order_controller = __esm({
  "src/modules/order/order.controller.ts"() {
    "use strict";
    init_order_service();
    createOrder2 = async (req, res) => {
      try {
        const payload = req.body;
        const customerId = req.user?.id;
        const orderData = {
          ...payload,
          customerId
        };
        const order = await orderService.createOrder(orderData);
        return res.status(201).json({
          success: true,
          message: "Order created successfully",
          data: order
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create order"
        });
      }
    };
    getMyOrders = async (req, res) => {
      try {
        const customerId = req.user?.id;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const status = req.query.status;
        const result = await orderService.getCustomerOrders(customerId, {
          page,
          limit,
          status
        });
        return res.status(200).json({
          success: true,
          message: "Orders fetched successfully",
          data: result.data,
          meta: result.meta
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch orders"
        });
      }
    };
    getAllOrders2 = async (req, res) => {
      try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const status = req.query.status;
        const search = req.query.search;
        const result = await orderService.getAllOrders({
          page,
          limit,
          status,
          search
        });
        return res.status(200).json({
          success: true,
          message: "Orders fetched successfully",
          data: result.data,
          meta: result.meta
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch orders"
        });
      }
    };
    getOrdersBySeller2 = async (req, res) => {
      try {
        const sellerId = req.user?.id;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const status = req.query.status;
        const search = req.query.search;
        const result = await orderService.getOrdersBySeller(sellerId, {
          page,
          limit,
          status,
          search
        });
        return res.status(200).json({
          success: true,
          message: "Your orders fetched successfully",
          data: result.data,
          meta: result.meta
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch orders"
        });
      }
    };
    getOrderDetails2 = async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const order = await orderService.getOrderDetails(id);
        const isCustomer = order.customer.id === userId;
        const isSeller = order.items.some((item) => item.medicine.seller.id === userId);
        const isAdmin = userRole === "ADMIN";
        if (!isCustomer && !isSeller && !isAdmin) {
          return res.status(403).json({
            success: false,
            message: "Access denied. You can only view your own orders or orders containing your medicines."
          });
        }
        return res.status(200).json({
          success: true,
          message: "Order details fetched successfully",
          data: order
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Order not found"
        });
      }
    };
    updateOrderStatus2 = async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const payload = {
          orderId: id,
          status,
          userRole,
          userId
        };
        const updatedOrder = await orderService.updateOrderStatus(payload);
        return res.status(200).json({
          success: true,
          message: "Order status updated successfully",
          data: updatedOrder
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update order status"
        });
      }
    };
    checkout = async (req, res) => {
      try {
        const customerId = req.user?.id;
        const payload = req.body;
        const order = await orderService.createOrderFromCart(customerId, payload);
        return res.status(201).json({
          success: true,
          message: "Order created from cart successfully",
          data: order
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create order from cart"
        });
      }
    };
    orderController = {
      createOrder: createOrder2,
      checkout,
      getMyOrders,
      getAllOrders: getAllOrders2,
      getOrdersBySeller: getOrdersBySeller2,
      getOrderDetails: getOrderDetails2,
      updateOrderStatus: updateOrderStatus2
    };
  }
});

// src/modules/order/order.router.ts
import { Router as Router5 } from "express";
var router5, orderRoutes;
var init_order_router = __esm({
  "src/modules/order/order.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_roleGuard_middleware();
    init_order_controller();
    init_role();
    router5 = Router5();
    router5.post("/", requireAuth, orderController.createOrder);
    router5.get("/my-orders", requireAuth, orderController.getMyOrders);
    router5.post("/checkout", requireAuth, orderController.checkout);
    router5.get("/dashboard/orders", requireAuth, roleGuard("SELLER" /* SELLER */), orderController.getOrdersBySeller);
    router5.get("/:id", requireAuth, orderController.getOrderDetails);
    router5.put("/:id/status", requireAuth, roleGuard("ADMIN" /* ADMIN */, "SELLER" /* SELLER */), orderController.updateOrderStatus);
    orderRoutes = router5;
  }
});

// src/modules/cartItem/cartItem.service.ts
var addToCart, getCartItems, updateCartItemQuantity, removeFromCart, clearCart, cartItemService;
var init_cartItem_service = __esm({
  "src/modules/cartItem/cartItem.service.ts"() {
    "use strict";
    init_prisma();
    addToCart = async (payload) => {
      const { userId, medicineId, quantity = 1 } = payload;
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId },
        include: {
          category: true,
          seller: {
            select: {
              shopName: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      if (medicine.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${medicine.stock}, Requested: ${quantity}`);
      }
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_medicineId: {
            userId,
            medicineId
          }
        }
      });
      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantity;
        if (medicine.stock < newQuantity) {
          throw new Error(`Insufficient stock. Available: ${medicine.stock}, Total in cart would be: ${newQuantity}`);
        }
        const updatedCartItem = await prisma.cartItem.update({
          where: {
            userId_medicineId: {
              userId,
              medicineId
            }
          },
          data: {
            quantity: newQuantity
          },
          include: {
            medicine: {
              include: {
                category: true,
                seller: {
                  select: {
                    shopName: true,
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        return updatedCartItem;
      } else {
        const cartItem = await prisma.cartItem.create({
          data: {
            userId,
            medicineId,
            quantity
          },
          include: {
            medicine: {
              include: {
                category: true,
                seller: {
                  select: {
                    shopName: true,
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        return cartItem;
      }
    };
    getCartItems = async (userId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          medicine: {
            include: {
              category: true,
              seller: {
                select: {
                  shopName: true,
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const cartWithTotals = cartItems.map((item) => {
        const isAvailable = item.medicine.stock >= item.quantity;
        const itemTotal = Number(item.medicine.price) * item.quantity;
        return {
          ...item,
          isAvailable,
          itemTotal,
          medicine: {
            ...item.medicine,
            price: Number(item.medicine.price)
          }
        };
      });
      const cartTotal = cartWithTotals.reduce((total, item) => total + item.itemTotal, 0);
      const totalItems = cartWithTotals.reduce((total, item) => total + item.quantity, 0);
      const hasUnavailableItems = cartWithTotals.some((item) => !item.isAvailable);
      return {
        items: cartWithTotals,
        summary: {
          totalItems,
          cartTotal,
          hasUnavailableItems
        }
      };
    };
    updateCartItemQuantity = async (userId, medicineId, quantity) => {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId_medicineId: {
            userId,
            medicineId
          }
        },
        include: {
          medicine: true
        }
      });
      if (!cartItem) {
        throw new Error("Cart item not found");
      }
      if (cartItem.medicine.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${cartItem.medicine.stock}, Requested: ${quantity}`);
      }
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          userId_medicineId: {
            userId,
            medicineId
          }
        },
        data: {
          quantity
        },
        include: {
          medicine: {
            include: {
              category: true,
              seller: {
                select: {
                  shopName: true,
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      return updatedCartItem;
    };
    removeFromCart = async (userId, medicineId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId_medicineId: {
            userId,
            medicineId
          }
        }
      });
      if (!cartItem) {
        throw new Error("Cart item not found");
      }
      await prisma.cartItem.delete({
        where: {
          userId_medicineId: {
            userId,
            medicineId
          }
        }
      });
      return { message: "Item removed from cart successfully" };
    };
    clearCart = async (userId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new Error("User not found");
      }
      await prisma.cartItem.deleteMany({
        where: { userId }
      });
      return { message: "Cart cleared successfully" };
    };
    cartItemService = {
      addToCart,
      getCartItems,
      updateCartItemQuantity,
      removeFromCart,
      clearCart
    };
  }
});

// src/modules/cartItem/cartItem.controller.ts
var addToCart2, getCartItems2, updateCartItemQuantity2, removeFromCart2, clearCart2, cartItemController;
var init_cartItem_controller = __esm({
  "src/modules/cartItem/cartItem.controller.ts"() {
    "use strict";
    init_cartItem_service();
    addToCart2 = async (req, res) => {
      try {
        const { medicineId, quantity } = req.body;
        const userId = req.user?.id;
        const cartItem = await cartItemService.addToCart({
          userId,
          medicineId,
          quantity
        });
        return res.status(201).json({
          success: true,
          message: "Item added to cart successfully",
          data: cartItem
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to add item to cart"
        });
      }
    };
    getCartItems2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const cart = await cartItemService.getCartItems(userId);
        return res.status(200).json({
          success: true,
          message: "Cart items fetched successfully",
          data: cart
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch cart items"
        });
      }
    };
    updateCartItemQuantity2 = async (req, res) => {
      try {
        const { medicineId } = req.params;
        const { quantity } = req.body;
        const userId = req.user?.id;
        const updatedCartItem = await cartItemService.updateCartItemQuantity(
          userId,
          medicineId,
          quantity
        );
        return res.status(200).json({
          success: true,
          message: "Cart item quantity updated successfully",
          data: updatedCartItem
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update cart item quantity"
        });
      }
    };
    removeFromCart2 = async (req, res) => {
      try {
        const { medicineId } = req.params;
        const userId = req.user?.id;
        const result = await cartItemService.removeFromCart(userId, medicineId);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Failed to remove item from cart"
        });
      }
    };
    clearCart2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const result = await cartItemService.clearCart(userId);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to clear cart"
        });
      }
    };
    cartItemController = {
      addToCart: addToCart2,
      getCartItems: getCartItems2,
      updateCartItemQuantity: updateCartItemQuantity2,
      removeFromCart: removeFromCart2,
      clearCart: clearCart2
    };
  }
});

// src/modules/cartItem/cartItem.router.ts
import { Router as Router6 } from "express";
var router6, cartItemRoutes;
var init_cartItem_router = __esm({
  "src/modules/cartItem/cartItem.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_cartItem_controller();
    init_roleGuard_middleware();
    init_role();
    router6 = Router6();
    router6.post("/", requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */), cartItemController.addToCart);
    router6.get("/", requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */), cartItemController.getCartItems);
    router6.put("/:medicineId", requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */), cartItemController.updateCartItemQuantity);
    router6.delete("/:medicineId", requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */), cartItemController.removeFromCart);
    router6.delete("/", requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */), cartItemController.clearCart);
    cartItemRoutes = router6;
  }
});

// src/modules/reviews/reviews.service.ts
var createReview, getReviewsByMedicine, getMyReviews, updateReview, deleteReview, getMedicineRatingStats, reviewService;
var init_reviews_service = __esm({
  "src/modules/reviews/reviews.service.ts"() {
    "use strict";
    init_prisma();
    init_enums();
    createReview = async (userId, payload) => {
      const { medicineId, rating, comment } = payload;
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      });
      if (!medicine) {
        throw new Error("Medicine not found");
      }
      const hasPurchased = await prisma.orderItem.findFirst({
        where: {
          medicineId,
          order: {
            customerId: userId,
            status: {
              not: OrderStatus.CANCELLED
            }
          }
        }
      });
      if (!hasPurchased) {
        throw new Error("You can only review medicines you have purchased");
      }
      const existingReview = await prisma.review.findFirst({
        where: {
          userId,
          medicineId
        }
      });
      if (existingReview) {
        throw new Error("You have already reviewed this medicine");
      }
      const review = await prisma.review.create({
        data: {
          userId,
          medicineId,
          rating,
          comment: comment || ""
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      });
      return review;
    };
    getReviewsByMedicine = async (medicineId, page = 1, limit = 10) => {
      const skip = (page - 1) * limit;
      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { medicineId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit
        }),
        prisma.review.count({
          where: { medicineId }
        })
      ]);
      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    };
    getMyReviews = async (userId, page = 1, limit = 10) => {
      const skip = (page - 1) * limit;
      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { userId },
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit
        }),
        prisma.review.count({
          where: { userId }
        })
      ]);
      return {
        reviews,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    };
    updateReview = async (reviewId, userId, payload) => {
      const { rating, comment } = payload;
      if (rating !== void 0 && (rating < 1 || rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
      }
      const existingReview = await prisma.review.findFirst({
        where: {
          id: reviewId,
          userId
        }
      });
      if (!existingReview) {
        throw new Error("Review not found or you don't have permission to update it");
      }
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          ...rating !== void 0 && { rating },
          ...comment !== void 0 && { comment }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      });
      return updatedReview;
    };
    deleteReview = async (reviewId, userId) => {
      const existingReview = await prisma.review.findFirst({
        where: {
          id: reviewId,
          userId
        }
      });
      if (!existingReview) {
        throw new Error("Review not found or you don't have permission to delete it");
      }
      await prisma.review.delete({
        where: { id: reviewId }
      });
      return { message: "Review deleted successfully" };
    };
    getMedicineRatingStats = async (medicineId) => {
      const reviews = await prisma.review.findMany({
        where: { medicineId },
        select: { rating: true }
      });
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          }
        };
      }
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Number((totalRating / reviews.length).toFixed(1));
      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution
      };
    };
    reviewService = {
      createReview,
      getReviewsByMedicine,
      getMyReviews,
      updateReview,
      deleteReview,
      getMedicineRatingStats
    };
  }
});

// src/modules/reviews/reviews.controller.ts
var createReview2, getReviewsByMedicine2, getMyReviews2, updateReview2, deleteReview2, getMedicineRatingStats2, reviewController;
var init_reviews_controller = __esm({
  "src/modules/reviews/reviews.controller.ts"() {
    "use strict";
    init_reviews_service();
    createReview2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const payload = req.body;
        const review = await reviewService.createReview(userId, payload);
        return res.status(201).json({
          success: true,
          message: "Review created successfully",
          data: review
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create review"
        });
      }
    };
    getReviewsByMedicine2 = async (req, res) => {
      try {
        const { medicineId } = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await reviewService.getReviewsByMedicine(medicineId, page, limit);
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to fetch reviews"
        });
      }
    };
    getMyReviews2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await reviewService.getMyReviews(userId, page, limit);
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to fetch reviews"
        });
      }
    };
    updateReview2 = async (req, res) => {
      try {
        const { reviewId } = req.params;
        const userId = req.user?.id;
        const payload = req.body;
        const review = await reviewService.updateReview(reviewId, userId, payload);
        return res.status(200).json({
          success: true,
          message: "Review updated successfully",
          data: review
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update review"
        });
      }
    };
    deleteReview2 = async (req, res) => {
      try {
        const { reviewId } = req.params;
        const userId = req.user?.id;
        const result = await reviewService.deleteReview(reviewId, userId);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to delete review"
        });
      }
    };
    getMedicineRatingStats2 = async (req, res) => {
      try {
        const { medicineId } = req.params;
        const stats = await reviewService.getMedicineRatingStats(medicineId);
        return res.status(200).json({
          success: true,
          data: stats
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to fetch rating statistics"
        });
      }
    };
    reviewController = {
      createReview: createReview2,
      getReviewsByMedicine: getReviewsByMedicine2,
      getMyReviews: getMyReviews2,
      updateReview: updateReview2,
      deleteReview: deleteReview2,
      getMedicineRatingStats: getMedicineRatingStats2
    };
  }
});

// src/modules/reviews/reviews.router.ts
import { Router as Router7 } from "express";
var router7, reviewRoutes;
var init_reviews_router = __esm({
  "src/modules/reviews/reviews.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_reviews_controller();
    router7 = Router7();
    router7.get("/medicine/:medicineId", reviewController.getReviewsByMedicine);
    router7.get("/medicine/:medicineId/stats", reviewController.getMedicineRatingStats);
    router7.post("/", requireAuth, reviewController.createReview);
    router7.get("/my-reviews", requireAuth, reviewController.getMyReviews);
    router7.put("/:reviewId", requireAuth, reviewController.updateReview);
    router7.delete("/:reviewId", requireAuth, reviewController.deleteReview);
    reviewRoutes = router7;
  }
});

// src/modules/admin/admin.router.ts
import { Router as Router8 } from "express";
var router8, adminRoutes;
var init_admin_router = __esm({
  "src/modules/admin/admin.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_role();
    init_roleGuard_middleware();
    init_sellerProfile_controller();
    init_categories_controller();
    init_order_controller();
    router8 = Router8();
    router8.use(requireAuth, roleGuard("ADMIN" /* ADMIN */));
    router8.get("/orders", orderController.getAllOrders);
    router8.get("/categories", categoryController.getAllCategories);
    router8.post("/categories", categoryController.createCategory);
    router8.put("/categories/:id", categoryController.updateCategory);
    router8.delete("/categories/:id", categoryController.deleteCategory);
    router8.get("/sellers", sellerProfileController.getAllSellers);
    adminRoutes = router8;
  }
});

// src/modules/address/address.service.ts
var createAddress, getAddressesByUser, getAddressById, updateAddress, deleteAddress, setDefaultAddress, addressService;
var init_address_service = __esm({
  "src/modules/address/address.service.ts"() {
    "use strict";
    init_prisma();
    createAddress = async (payload) => {
      const { userId, isDefault } = payload;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      if (isDefault) {
        await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
      }
      const address = await prisma.address.create({ data: payload });
      return address;
    };
    getAddressesByUser = async (userId) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      const addresses = await prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
      return addresses;
    };
    getAddressById = async (id, userId) => {
      const address = await prisma.address.findUnique({ where: { id } });
      if (!address) throw new Error("Address not found");
      if (userId && address.userId !== userId) throw new Error("Access denied");
      return address;
    };
    updateAddress = async (payload) => {
      const { id, userId, isDefault } = payload;
      const existing = await prisma.address.findUnique({ where: { id } });
      if (!existing) throw new Error("Address not found");
      if (existing.userId !== userId) throw new Error("Access denied");
      return await prisma.$transaction(async (tx) => {
        if (isDefault) {
          await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
        }
        const { id: _omit, userId: _uid, ...rest } = payload;
        const data = { ...rest };
        delete data.id;
        delete data.userId;
        const updated = await tx.address.update({ where: { id }, data });
        return updated;
      });
    };
    deleteAddress = async (id, userId) => {
      const existing = await prisma.address.findUnique({ where: { id } });
      if (!existing) throw new Error("Address not found");
      if (existing.userId !== userId) throw new Error("Access denied");
      await prisma.address.delete({ where: { id } });
      return { message: "Address deleted successfully" };
    };
    setDefaultAddress = async (id, userId) => {
      const existing = await prisma.address.findUnique({ where: { id } });
      if (!existing) throw new Error("Address not found");
      if (existing.userId !== userId) throw new Error("Access denied");
      return await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
        const updated = await tx.address.update({ where: { id }, data: { isDefault: true } });
        return updated;
      });
    };
    addressService = {
      createAddress,
      getAddressesByUser,
      getAddressById,
      updateAddress,
      deleteAddress,
      setDefaultAddress
    };
  }
});

// src/modules/address/address.controller.ts
var createAddress2, getMyAddresses, getAddress, updateAddress2, deleteAddress2, setDefaultAddress2, addressController;
var init_address_controller = __esm({
  "src/modules/address/address.controller.ts"() {
    "use strict";
    init_address_service();
    createAddress2 = async (req, res) => {
      try {
        const userId = req.user?.id;
        const payload = req.body;
        const addressData = {
          ...payload,
          userId
        };
        const address = await addressService.createAddress(addressData);
        return res.status(201).json({
          success: true,
          message: "Address created successfully",
          data: address
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create address"
        });
      }
    };
    getMyAddresses = async (req, res) => {
      try {
        const userId = req.user?.id;
        const addresses = await addressService.getAddressesByUser(userId);
        return res.status(200).json({
          success: true,
          message: "Addresses fetched successfully",
          data: addresses
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch addresses"
        });
      }
    };
    getAddress = async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const address = await addressService.getAddressById(id, userId);
        return res.status(200).json({
          success: true,
          message: "Address fetched successfully",
          data: address
        });
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: error.message || "Address not found"
        });
      }
    };
    updateAddress2 = async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const payload = req.body;
        const updateData = {
          id,
          userId,
          ...payload
        };
        const address = await addressService.updateAddress(updateData);
        return res.status(200).json({
          success: true,
          message: "Address updated successfully",
          data: address
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to update address"
        });
      }
    };
    deleteAddress2 = async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const result = await addressService.deleteAddress(id, userId);
        return res.status(200).json({
          success: true,
          message: result.message
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to delete address"
        });
      }
    };
    setDefaultAddress2 = async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const address = await addressService.setDefaultAddress(id, userId);
        return res.status(200).json({
          success: true,
          message: "Default address updated successfully",
          data: address
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to set default address"
        });
      }
    };
    addressController = {
      createAddress: createAddress2,
      getMyAddresses,
      getAddress,
      updateAddress: updateAddress2,
      deleteAddress: deleteAddress2,
      setDefaultAddress: setDefaultAddress2
    };
  }
});

// src/modules/address/address.router.ts
import { Router as Router9 } from "express";
var router9, addressRoutes;
var init_address_router = __esm({
  "src/modules/address/address.router.ts"() {
    "use strict";
    init_auth_middleware();
    init_roleGuard_middleware();
    init_address_controller();
    init_role();
    router9 = Router9();
    router9.use(requireAuth, roleGuard("CUSTOMER" /* CUSTOMER */));
    router9.post("/", addressController.createAddress);
    router9.get("/", addressController.getMyAddresses);
    router9.get("/:id", addressController.getAddress);
    router9.put("/:id", addressController.updateAddress);
    router9.delete("/:id", addressController.deleteAddress);
    router9.put("/:id/default", addressController.setDefaultAddress);
    addressRoutes = router9;
  }
});

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_auth();
    init_user_router();
    init_categories_router();
    init_sellerProfile_router();
    init_medicine_router();
    init_order_router();
    init_cartItem_router();
    init_reviews_router();
    init_admin_router();
    init_address_router();
    app = express();
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.use(cors(
      {
        origin: process.env.APP_URL,
        credentials: true
      }
    ));
    app.use(express.json());
    app.use("/api/auth", userRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/medicines", medicineRoutes);
    app.use("/api/sellers", sellerProfileRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/cart", cartItemRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/addresses", addressRoutes);
    app.use("/api/admin", adminRoutes);
    app.get("/", (_, res) => {
      res.json({ status: "OK", message: "MediStore API running" });
    });
    app_default = app;
  }
});

// src/server.ts
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_prisma();
    var PORT = process.env.PORT || 5e3;
    async function main() {
      try {
        await prisma.$connect();
        console.log("Connected to database");
        app_default.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      } catch (error) {
      }
    }
    main();
  }
});
export default require_server();
