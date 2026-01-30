import { Router } from "express";
import { categoryController } from "./categories.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/roleGuard.middleware";
import { USER_ROLE } from "../../types/role";

const router = Router();

/**
 * Public routes
 */
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getSingleCategory);

// Admin routes moved to /api/admin/categories

export const categoryRoutes = router;