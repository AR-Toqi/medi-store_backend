import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { USER_ROLE } from "../../types/role";
import { roleGuard } from './../../middlewares/roleGuard.middleware';

// Import admin controllers
import { sellerProfileController } from './../sellerProfile/sellerProfile.controller';
import { categoryController } from './../categories/categories.controller';
import { orderController } from './../order/order.controller';

const router = Router();

// Apply admin authentication to all routes
router.use(requireAuth, roleGuard(USER_ROLE.ADMIN));

// Admin dashboard routes
router.get("/orders", orderController.getAllOrders);
router.get("/categories", categoryController.getAllCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.get("/sellers", sellerProfileController.getAllSellers);

export const adminRoutes = router;