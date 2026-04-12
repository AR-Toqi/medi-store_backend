"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
//* Register
router.post("/register", auth_controller_1.authController.signUp);
//* Login
router.post("/login", auth_controller_1.authController.signIn);
//* Verify Email
router.post("/verify-email", auth_controller_1.authController.verifyEmail);
//* Logout
router.post("/logout", auth_controller_1.authController.signOut);
exports.authRoutes = router;
//# sourceMappingURL=auth.router.js.map