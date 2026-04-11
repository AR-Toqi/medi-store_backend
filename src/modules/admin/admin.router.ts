import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { USER_ROLE } from "../../types/role";
import { roleGuard } from './../../middlewares/roleGuard.middleware';
import { adminController } from "./admin.controller";

const router = Router();

// Apply admin authentication and role guard to all routes
router.use(requireAuth, roleGuard(USER_ROLE.ADMIN));

// User Management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUser);
router.get("/sellers", adminController.getAllSellers);
router.delete("/sellers/:id", adminController.deleteSeller);

// Order Management
router.get("/orders", adminController.getAllOrders);

// Medicine Management
router.get("/medicines", adminController.getAllMedicines);

// Category Management
router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

export const adminRoutes = router;