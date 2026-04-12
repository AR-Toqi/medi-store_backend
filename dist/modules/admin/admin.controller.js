"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const order_service_1 = require("../order/order.service");
const medicine_service_1 = require("../medicine/medicine.service");
const categories_service_1 = require("../categories/categories.service");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.adminService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});
const updateUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { isBanned } = req.body;
    const result = await admin_service_1.adminService.updateUserStatus(id, isBanned);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    await admin_service_1.adminService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deleted successfully",
        data: null,
    });
});
const getAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const status = req.query.status;
    const search = req.query.search;
    const result = await order_service_1.orderService.getAllOrders({
        page,
        limit,
        status,
        search,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All orders fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getAllMedicines = (0, catchAsync_1.default)(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const search = req.query.search;
    const result = await medicine_service_1.medicineService.getAllMedicines({
        page,
        limit,
        search,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All medicines fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
const getAllSellers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.adminService.getAllSellers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sellers fetched successfully",
        data: result,
    });
});
const deleteSeller = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    await admin_service_1.adminService.deleteSeller(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Seller profile deleted successfully",
        data: null,
    });
});
// Category Management (Delegated)
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await categories_service_1.categoryService.createCategory(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});
const getAllCategories = (0, catchAsync_1.default)(async (req, res) => {
    const result = await categories_service_1.categoryService.getAllCategories(true);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Categories fetched successfully",
        data: result,
    });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await categories_service_1.categoryService.updateCategory(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    await categories_service_1.categoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category deleted successfully",
        data: null,
    });
});
exports.adminController = {
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getAllOrders,
    getAllMedicines,
    getAllSellers,
    deleteSeller,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=admin.controller.js.map