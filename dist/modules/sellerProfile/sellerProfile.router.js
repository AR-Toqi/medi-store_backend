"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerProfileRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const sellerProfile_controller_1 = require("./sellerProfile.controller");
const router = (0, express_1.Router)();
//* Create seller profile (become a seller)
router.post("/", auth_middleware_1.requireAuth, sellerProfile_controller_1.sellerProfileController.createSellerProfile);
exports.sellerProfileRoutes = router;
//# sourceMappingURL=sellerProfile.router.js.map