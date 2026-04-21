import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { adminService } from "./admin.service";
import { deleteFromCloudinary } from "../../utils/cloudinary";
import { orderService } from "../order/order.service";
import { medicineService } from "../medicine/medicine.service";
import { categoryService } from "../categories/categories.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isBanned } = req.body;
  const result = await adminService.updateUserStatus(id, isBanned);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await adminService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;
  const search = req.query.search as string;

  const result = await orderService.getAllOrders({
    page,
    limit,
    status,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All orders fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string;

  const result = await medicineService.getAllMedicines({
    page,
    limit,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All medicines fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getAllSellers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllSellers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sellers fetched successfully",
    data: result,
  });
});

const deleteSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await adminService.deleteSeller(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller profile deleted successfully",
    data: null,
  });
});

// Category Management (Delegated)
const createCategory = catchAsync(async (req: AuthRequest, res: Response) => {
  const categoryData = { ...req.body };
  if (req.file) {
    categoryData.image = req.file.path;
  }
  try {
    const result = await categoryService.createCategory(categoryData);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    throw error;
  }
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories(true);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const categoryData = { ...req.body };
  if (req.file) {
    categoryData.image = req.file.path;
  }
  try {
    const result = await categoryService.updateCategory(id, categoryData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    throw error;
  }
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await categoryService.deleteCategory(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin stats fetched successfully",
    data: result,
  });
});

export const adminController = {
  getStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  getAllMedicines,
  getAllSellers,
  deleteSeller,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
