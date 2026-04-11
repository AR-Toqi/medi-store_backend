import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { categoryService } from './categories.service';
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";

/**
 * Create Category (Admin only via roleGuard)
 */
const createCategory = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

/**
 * Get All Categories (Public)
 */
const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

/**
 * Get Single Category by ID (Public)
 */
const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getSingleCategory(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category details fetched successfully",
    data: result,
  });
});

/**
 * Update Category (Admin only via roleGuard)
 */
const updateCategory = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.updateCategory(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

/**
 * Delete Category (Admin only via roleGuard)
 */
const deleteCategory = catchAsync(async (req: AuthRequest, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
