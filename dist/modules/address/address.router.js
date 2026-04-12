"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roleGuard_middleware_1 = require("../../middlewares/roleGuard.middleware");
const address_controller_1 = require("./address.controller");
const role_1 = require("../../types/role");
const router = (0, express_1.Router)();
// All address routes require authentication and customer role
router.use(auth_middleware_1.requireAuth, (0, roleGuard_middleware_1.roleGuard)(role_1.USER_ROLE.CUSTOMER));
// Address management routes
router.post("/", address_controller_1.addressController.createAddress);
router.get("/", address_controller_1.addressController.getMyAddresses);
router.get("/:id", address_controller_1.addressController.getAddress);
router.put("/:id", address_controller_1.addressController.updateAddress);
router.delete("/:id", address_controller_1.addressController.deleteAddress);
// Set default address
router.put("/:id/default", address_controller_1.addressController.setDefaultAddress);
exports.addressRoutes = router;
//# sourceMappingURL=address.router.js.map