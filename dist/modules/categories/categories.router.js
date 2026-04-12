"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const categories_controller_1 = require("./categories.controller");
const router = (0, express_1.Router)();
/**
 * Public routes
 */
router.get("/categories", categories_controller_1.categoryController.getAllCategories);
router.get("/categories/:id", categories_controller_1.categoryController.getSingleCategory);
// Admin routes moved to /api/admin/categories
exports.categoryRoutes = router;
//# sourceMappingURL=categories.router.js.map