import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../app/errors/AppError";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
      sellerProfile: {
        select: {
          shopName: true,
          isVerified: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

const updateUserStatus = async (id: string, isBanned: boolean) => {
  const result = await prisma.user.update({
    where: { id },
    data: { isBanned },
  });
  return result;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isBanned) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Active users cannot be deleted. Please ban the user first."
    );
  }

  await prisma.user.delete({
    where: { id },
  });
};

const getAllSellers = async () => {
  const sellers = await prisma.sellerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          isBanned: true
        }
      }
    }
  });
  return sellers;
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllSellers,
  deleteUser
};
