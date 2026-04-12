"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const token_utils_1 = require("../utils/token.utils");
const prisma_1 = require("../lib/prisma");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = "";
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1] || "";
        }
        else if (req.cookies.accessToken) {
            token = req.cookies.accessToken || "";
        }
        if (!token ||
            token === "undefined" ||
            token === "null" ||
            token === "{{accessToken}}" ||
            token.trim() === "" ||
            token.split(".").length !== 3) {
            const message = token === "{{accessToken}}"
                ? "Unauthorized - Postman variable {{accessToken}} is not set. Please run the Login request first."
                : "Unauthorized - Invalid or malformed token format";
            return res.status(401).json({
                success: false,
                message,
            });
        }
        const decoded = (0, token_utils_1.verifyToken)(token, process.env.BETTER_AUTH_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token",
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
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
            role: user.role,
            isBanned: user.isBanned,
            emailVerified: user.emailVerified,
        };
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token",
        });
    }
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.middleware.js.map