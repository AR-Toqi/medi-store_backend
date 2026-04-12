"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicineController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const medicine_service_1 = require("./medicine.service");
/**
 * Public: Get all medicines with filters
 */
const getAllMedicines = (0, catchAsync_1.default)(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const search = req.query.search;
    const categoryId = req.query.categoryId;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const manufacturer = req.query.manufacturer;
    const isFeatured = req.query.isFeatured;
    const result = await medicine_service_1.medicineService.getAllMedicines({
        page,
        limit,
        search,
        categoryId,
        minPrice,
        maxPrice,
        manufacturer,
        isFeatured,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicines fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
/**
 * Public: Get medicine details by slug
 */
const getMedicineDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { slug } = req.params;
    const medicine = await medicine_service_1.medicineService.getMedicineDetails(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicine details fetched successfully",
        data: medicine,
    });
});
exports.medicineController = {
    getAllMedicines,
    getMedicineDetails,
};
//# sourceMappingURL=medicine.controller.js.map