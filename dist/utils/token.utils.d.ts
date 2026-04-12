import jwt, { Secret } from "jsonwebtoken";
export declare const generateAccessToken: (payload: {
    id: string;
    email: string;
    role: string;
}, secret: Secret, expiresIn: any) => string;
export declare const generateRefreshToken: (payload: {
    id: string;
    email: string;
    role: string;
}, secret: Secret, expiresIn: any) => string;
export declare const verifyToken: (token: string, secret: Secret) => string | jwt.JwtPayload;
//# sourceMappingURL=token.utils.d.ts.map