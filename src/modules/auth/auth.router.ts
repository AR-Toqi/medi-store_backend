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

export const authRoutes = router;
