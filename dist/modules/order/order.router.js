"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roleGuard_middleware_1 = require("../../middlewares/roleGuard.middleware");
const order_controller_1 = require("./order.controller");
const role_1 = require("../../types/role");
const router = (0, express_1.Router)();
//* Customer routes (authenticated users)
router.post("/", auth_middleware_1.requireAuth, order_controller_1.orderController.createOrder);
router.get("/my-orders", auth_middleware_1.requireAuth, order_controller_1.orderController.getMyOrders);
router.post("/checkout", auth_middleware_1.requireAuth, order_controller_1.orderController.createOrder);
//* Shared routes (customer and admin reach this)
router.get("/:id", auth_middleware_1.requireAuth, order_controller_1.orderController.getOrderDetails);
router.patch("/:id/cancel", auth_middleware_1.requireAuth, order_controller_1.orderController.cancelMyOrder);
router.put("/:id/status", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.ADMIN), order_controller_1.orderController.updateOrderStatus);
exports.orderRoutes = router;
//# sourceMappingURL=order.router.js.map