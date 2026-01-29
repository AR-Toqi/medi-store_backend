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

/**
 * Admin-only routes
 */
router.post(
  "/categories",
  requireAuth,
  roleGuard(USER_ROLE.ADMIN),
  categoryController.createCategory
);

router.put(
  "/categories/:id",
  requireAuth,
  roleGuard(USER_ROLE.ADMIN),
  categoryController.updateCategory
);

router.delete(
  "/categories/:id",
  requireAuth,
  roleGuard(USER_ROLE.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoutes = router;