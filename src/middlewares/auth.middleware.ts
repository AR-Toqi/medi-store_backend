import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { verifyToken } from "../utils/token.utils";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isBanned: boolean;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = verifyToken(
      token,
      process.env.BETTER_AUTH_SECRET as Secret
    ) as any;

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Access denied - User is banned",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as string,
      isBanned: user.isBanned as boolean,
    };

    next();
  } catch (error: any) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};