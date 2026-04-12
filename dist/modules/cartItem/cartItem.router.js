"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const cartItem_controller_1 = require("./cartItem.controller");
const roleGuard_middleware_1 = require("../../middlewares/roleGuard.middleware");
const role_1 = require("../../types/role");
// import { verifyEmailGuard } from "../../middlewares/verifyEmail.middleware";
const router = (0, express_1.Router)();
//* Cart management routes
router.post("/", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER), cartItem_controller_1.cartItemController.addToCart);
router.get("/", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER), cartItem_controller_1.cartItemController.getCartItems);
router.put("/:medicineId", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER), cartItem_controller_1.cartItemController.updateCartItemQuantity);
router.delete("/:medicineId", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER), cartItem_controller_1.cartItemController.removeFromCart);
router.delete("/", auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER), cartItem_controller_1.cartItemController.clearCart);
exports.cartItemRoutes = router;
//# sourceMappingURL=cartItem.router.js.map