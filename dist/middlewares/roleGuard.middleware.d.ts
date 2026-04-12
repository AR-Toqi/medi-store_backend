import { NextFunction, Response } from 'express';
import { USER_ROLE } from '../types/role';
import { AuthRequest } from './auth.middleware';
export declare const roleGuard: (...roles: USER_ROLE[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=roleGuard.middleware.d.ts.map