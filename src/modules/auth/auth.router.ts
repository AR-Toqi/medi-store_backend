import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

//* Register
router.post("/register", authController.signUp);

//* Login
router.post("/login", authController.signIn);

//* Logout
router.post("/logout", authController.signOut);

export const authRoutes = router;
