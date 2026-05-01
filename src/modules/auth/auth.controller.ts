import { Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import AppError from "../../app/errors/AppError";

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

  const { accessToken, refreshToken, sessionToken, user } = result;

  const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  // Set tokens in httpOnly cookies
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (sessionToken) {
    res.cookie("better-auth.session_token", sessionToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (match refreshToken)
    });
  }

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
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.clearCookie("better-auth.session_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Verification failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully",
    data: result.user,
  });

  if (result.sessionToken) {
    res.cookie("better-auth.session_token", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  const result = await authService.refreshToken(refreshToken);

  const { accessToken, user } = result;

  // Set new accessToken in httpOnly cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully",
    data: {
      user,
      accessToken,
    },
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset OTP sent successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  // Pass req.headers directly so Better Auth knows the host and origin
  const result = await authService.googleLogin(req.headers);

  // If Better Auth returned headers (like Set-Cookie for state), apply them
  if (result && result.headers) {
    result.headers.forEach((value: string, key: string) => {
      res.append(key, value);
    });
  }

  if (result && result.url) {
    res.redirect(result.url);
  } else {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to initiate Google login");
  }
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleLoginSuccess(req.headers);
  const { accessToken, refreshToken, sessionToken } = result;

  const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (sessionToken) {
    res.cookie("better-auth.session_token", sessionToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  res.redirect(`${appUrl}/login-success`);
});

const handleOAuthError = catchAsync(async (req: Request, res: Response) => {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const error = req.query.error || "unknown_error";
  res.redirect(`${appUrl}/login-error?error=${error}`);
});

export const authController = {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
};
