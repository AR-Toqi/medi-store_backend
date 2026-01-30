import { Router } from "express";
import { categoryController } from "./categories.controller";

const router = Router();

/**
 * Public routes
 */
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getSingleCategory);

// Admin routes moved to /api/admin/categories

export const categoryRoutes = router;