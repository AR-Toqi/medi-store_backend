import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { USER_ROLE } from "../../types/role";
import { categoryService } from './categories.service';

/**
 * Create Category (Admin only)
 */
const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== USER_ROLE.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await categoryService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(409).json({
      success: false,
      message: error.message || "Failed to create category",
    });
  }
};

/**
 * Get All Categories (Public)
 */
const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

/**
 * Get Single Category by ID (Public)
 */
const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getSingleCategory(req.params.id as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Category not found",
    });
  }
};

/**
 * Update Category (Admin only)
 */
const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== USER_ROLE.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await categoryService.updateCategory(
      req.params.id as string,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};

/**
 * Delete Category (Admin only)
 */
const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== USER_ROLE.ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    await categoryService.deleteCategory(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
