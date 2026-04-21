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
          id: true,
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

  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2003") {
      throw new AppError(
        httpStatus.CONFLICT,
        "This user cannot be deleted because they have associated data (e.g., orders, reviews). Please keep the user banned instead to maintain platform history."
      );
    }
    throw error;
  }
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


const deleteSeller = async (id: string) => {
  const cleanId = id.trim();

  // Try to find by Profile ID or User ID (both are unique)
  const seller = await prisma.sellerProfile.findFirst({
    where: {
      OR: [
        { id: cleanId },
        { userId: cleanId }
      ]
    },
    include: { user: true }
  });

  if (!seller) {
    throw new AppError(httpStatus.NOT_FOUND, "Seller profile not found");
  }

  // Ensure user is banned before allowing deletion
  if (!seller.user.isBanned) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Active sellers cannot be deleted. Please ban the user account first."
    );
  }

  try {
    await prisma.sellerProfile.delete({
      where: { id: seller.id },
    });
  } catch (error: any) {
    if (error.code === "P2003") {
      throw new AppError(
        httpStatus.CONFLICT,
        "This seller cannot be deleted because they have associated medicines or order history. Please keep the user banned instead."
      );
    }
    throw error;
  }
};

const getStats = async () => {
  const [userCount, sellerCount, medicineCount, orderCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.sellerProfile.count(),
    prisma.medicine.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: "CANCELLED"
        }
      }
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });

  return {
    totalUsers: userCount,
    totalSellers: sellerCount,
    totalMedicines: medicineCount,
    totalOrders: orderCount,
    totalRevenue: revenue._sum.totalAmount || 0,
    recentOrders,
    recentUsers,
  };
};

export const adminService = {
  getStats,
  getAllUsers,
  updateUserStatus,
  getAllSellers,
  deleteUser,
  deleteSeller,
};
