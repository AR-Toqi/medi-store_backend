// import { NextFunction, Response } from "express";
// import httpStatus from "http-status";
// import { AuthRequest } from "./auth.middleware";
// import { authService } from "../modules/auth/auth.service";
// import { prisma } from "../lib/prisma";

// /**
//  * Middleware that ensures a user has a verified email address.
//  * If the email is not verified, it automatically triggers a new OTP
//  * and blocks the request with a 403 Forbidden status.
//  */
// export const verifyEmailGuard = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const user = req.user;

//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized - Please login first",
//     });
//   }

//   if (!user.emailVerified) {
//     // Fetch user name for the email template (names aren't in the JWT payload)
//     const userData = await prisma.user.findUnique({
//         where: { id: user.id },
//         select: { name: true }
//     });

//     // Automatically trigger OTP sending
//     await authService.sendVerificationOTP(user.id, user.email, userData?.name || "User");

//     return res.status(403).json({
//       success: false,
//       message: "Email verification required. A new OTP has been sent to your email address.",
//     });
//   }

//   next();
// };
