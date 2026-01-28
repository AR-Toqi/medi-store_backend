import { NextFunction, Response } from 'express';
import { USER_ROLE } from '../types/role';
import { AuthRequest } from './auth.middleware';


export const roleGuard = (...roles: USER_ROLE[]) =>(req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!roles.includes(req.user.role as USER_ROLE)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions",
      })
    }

    next()
  }