import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

//* Register
router.post("/register", authController.signUp);

//* Login
router.post("/login", authController.signIn);

//* Verify Email
router.post("/verify-email", authController.verifyEmail);

//* Logout
router.post("/logout", authController.signOut);

//* Refresh Token
router.post("/refresh-token", authController.refreshToken);

//* Forgot Password
router.post("/forgot-password", authController.forgotPassword);

//* Reset Password
router.post("/reset-password", authController.resetPassword);


router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);

export const authRoutes = router;
