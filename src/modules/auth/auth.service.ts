import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../../utils/token.utils";
import AppError from "../../app/errors/AppError";

const signUp = async (payload: any) => {
  const { email, password, name, role } = payload;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || "CUSTOMER",
    },
  });

  return newUser;
};

const signIn = async (payload: any) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (user.isBanned) {
    throw new AppError(httpStatus.FORBIDDEN, "User is banned");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role as string,
  };

  const accessToken = generateAccessToken(
    jwtPayload,
    process.env.BETTER_AUTH_SECRET as string,
    "1h"
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
  };
};

export const authService = {
  signUp,
  signIn,
};
