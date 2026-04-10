import { Request, Response } from "express";
import { authService } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.signIn(req.body);

    const { accessToken, refreshToken, user } = result;

    // Set tokens in httpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

export const authController = {
  signUp,
  signIn,
  signOut,
};
