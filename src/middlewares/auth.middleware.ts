import { NextFunction , Request, Response } from "express";
import { auth } from "../lib/auth";

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    isBanned: boolean
  }
}

export const requireAuth = async(req: AuthRequest, res: Response, next: NextFunction) =>{
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any
        })
        if (!session || !session.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verfiy your email!"
                })
            }
        if (session.user.isBanned) {
        return res.status(403).json({ message: "User is banned" })
        }
        req.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role as string,
            isBanned: session.user.isBanned as boolean
        }

        next();
    } catch (error) {
        
    }
}