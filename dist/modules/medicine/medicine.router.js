"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicineRoutes = void 0;
const express_1 = require("express");
const medicine_controller_1 = require("./medicine.controller");
const router = (0, express_1.Router)();
//* Public routes
router.get("/", medicine_controller_1.medicineController.getAllMedicines);
router.get("/:slug", medicine_controller_1.medicineController.getMedicineDetails);
exports.medicineRoutes = router;
//# sourceMappingURL=medicine.router.js.map