"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_1 = require("../../types/role");
const roleGuard_middleware_1 = require("./../../middlewares/roleGuard.middleware");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// Apply admin authentication and role guard to all routes
router.use(auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.ADMIN));
// User Management
router.get("/users", admin_controller_1.adminController.getAllUsers);
router.patch("/users/:id", admin_controller_1.adminController.updateUserStatus);
router.delete("/users/:id", admin_controller_1.adminController.deleteUser);
router.get("/sellers", admin_controller_1.adminController.getAllSellers);
router.delete("/sellers/:id", admin_controller_1.adminController.deleteSeller);
// Order Management
router.get("/orders", admin_controller_1.adminController.getAllOrders);
// Medicine Management
router.get("/medicines", admin_controller_1.adminController.getAllMedicines);
// Category Management
router.get("/categories", admin_controller_1.adminController.getAllCategories);
router.post("/categories", admin_controller_1.adminController.createCategory);
router.put("/categories/:id", admin_controller_1.adminController.updateCategory);
router.delete("/categories/:id", admin_controller_1.adminController.deleteCategory);
exports.adminRoutes = router;
//# sourceMappingURL=admin.router.js.map