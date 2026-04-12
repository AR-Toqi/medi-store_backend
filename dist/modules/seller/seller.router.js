"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roleGuard_middleware_1 = require("../../middlewares/roleGuard.middleware");
const role_1 = require("../../types/role");
const seller_controller_1 = require("./seller.controller");
const router = (0, express_1.Router)();
// Apply seller authentication and role guard to all routes
router.use(auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.SELLER));
// Dashboard & Analytics
router.get("/stats", seller_controller_1.sellerController.getDashboardStats);
// Medicine Management
router.get("/medicines", seller_controller_1.sellerController.getMyMedicines);
router.post("/medicines", seller_controller_1.sellerController.createMedicine);
router.get("/medicines/:slug", seller_controller_1.sellerController.getMedicineDetails);
router.patch("/medicines/:id", seller_controller_1.sellerController.updateMedicine);
router.delete("/medicines/:id", seller_controller_1.sellerController.deleteMedicine);
// Order Management
router.get("/orders", seller_controller_1.sellerController.getMyOrders);
router.patch("/orders/:id", seller_controller_1.sellerController.updateOrderStatus);
// Profile Management
router.get("/profile", seller_controller_1.sellerController.getProfile);
router.patch("/profile", seller_controller_1.sellerController.updateProfile);
router.delete("/profile", seller_controller_1.sellerController.deleteProfile);
exports.sellerRoutes = router;
//# sourceMappingURL=seller.router.js.map