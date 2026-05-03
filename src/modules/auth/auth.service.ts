import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/token.utils";
import AppError from "../../app/errors/AppError";
import { auth } from "../../lib/auth";
import { USER_ROLE } from "../../types/role";

const signUp = async (payload: any) => {
  const { email, password, name, role } = payload;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Delegate user creation and OTP generation directly to Better Auth
  // @ts-ignore - explicitly passing programmatic body
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      role: role || USER_ROLE.CUSTOMER
    }
  });

  if (role === USER_ROLE.ADMIN) {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { emailVerified: true },
    });
  }

  return result.user;
};

const signIn = async (payload: any) => {
  const { email, password } = payload;

  const session = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!session) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const user = session.user;
  const userRole = (user as any).role;

  if (!user.emailVerified && userRole !== USER_ROLE.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Email not verified");
  }

  if (session.user.isBanned || (user as any).isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, "User is banned");
  }

  const sessionToken = session.token;

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: userRole as string,
  };

  const accessToken = generateAccessToken(
    jwtPayload,
    process.env.BETTER_AUTH_SECRET as string,
    "1d"
  );

  const refreshToken = generateRefreshToken(
    jwtPayload,
    process.env.BETTER_AUTH_SECRET as string,
    "7d"
  );

  return {
    user,
    sessionToken,
    accessToken,
    refreshToken,
    requiresVerification: !user.emailVerified && userRole !== USER_ROLE.ADMIN
  };
};


const verifyEmail = async (payload: { email: string, otp?: string, code?: string }) => {
  const otpCode = payload.otp || payload.code;

  if (!otpCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Verification code is required");
  }

  const result = await auth.api.verifyEmailOTP({
    body: {
      email: payload.email,
      otp: otpCode as string,
    }
  });

  if (!result || !result.user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid verification code or user not found");
  }

  if (result.user && result.user.emailVerified) {
    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        emailVerified: true,
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: result.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      }
    });

    return {
      user,
      sessionToken: (result as any).token
    }
  }

  return {
    user: result.user,
    sessionToken: (result as any).token
  };
};

const refreshToken = async (token: string) => {
  // Custom verify
  try {
    const decoded = verifyToken(token, process.env.BETTER_AUTH_SECRET as string) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    if (user.isBanned) {
      throw new AppError(httpStatus.FORBIDDEN, "User is banned");
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role as string,
    };

    const accessToken = generateAccessToken(
      jwtPayload,
      process.env.BETTER_AUTH_SECRET as string,
      "1d"
    );

    return {
      user,
      accessToken,
    };
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
};

const forgotPassword = async (payload: { email: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    }
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email not verified");
  }

  await auth.api.sendVerificationOTP({
    body: {
      email: payload.email,
      type: "forget-password"
    }
  })
};

const resetPassword = async (payload: { email: string, otp: string, password: string }) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    }
  })

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!isUserExist.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email not verified");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email: payload.email,
      otp: payload.otp,
      password: payload.password,
    }
  })

  if (isUserExist.needsPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id,
      },
      data: {
        needsPasswordChange: false,
      }
    })
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id,
    }
  })
};

const googleLogin = async (reqHeaders: any) => {
  // Convert Express headers to standard Web API Headers so Better Auth can read host/origin
  const webHeaders = new Headers(reqHeaders as Record<string, string>);

  const betterAuthUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
  const callbackURL = `${betterAuthUrl}/api/auth/google/success`;
  
  console.log("Initiating Google Login with callbackURL:", callbackURL);

  const response: any = await auth.api.signInSocial({
    headers: webHeaders,
    returnHeaders: true, 
    body: {
      provider: "google",
      callbackURL, 
    },
  });
  
  if (response.headers) {
      const url = response?.response?.url || response?.data?.url || response?.url || response?.redirect;
      return { url, headers: response.headers };
  }
  
  return response;
};

const googleLoginSuccess = async (headers: any) => {
  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Session not found");
  }

  const user = session.user;
  const userRole = (user as any).role;

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: userRole as string,
  };

  const accessToken = generateAccessToken(
    jwtPayload,
    process.env.BETTER_AUTH_SECRET as string,
    "1d"
  );

  const refreshToken = generateRefreshToken(
    jwtPayload,
    process.env.BETTER_AUTH_SECRET as string,
    "7d"
  );

  return {
    user,
    accessToken,
    refreshToken,
    sessionToken: session.session.token,
  };
};

export const authService = {
  signUp,
  signIn,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
};
