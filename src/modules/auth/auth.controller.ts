import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";

const signUp = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signUp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
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

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully logged in",
    data: {
      user,
      accessToken,
    },
  });
});

const signOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const authController = {
  signUp,
  signIn,
  signOut,
};
