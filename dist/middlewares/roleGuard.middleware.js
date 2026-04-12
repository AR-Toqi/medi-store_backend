"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const roleGuard = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            message: "Access denied. Insufficient permissions",
        });
    }
    next();
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=roleGuard.middleware.js.map