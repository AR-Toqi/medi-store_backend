import { Router } from "express";
import { categoryController } from "./categories.controller";

const router = Router();

/**
 * Public routes
 */
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);

// Admin routes moved to /api/admin/categories

export const categoryRoutes = router;