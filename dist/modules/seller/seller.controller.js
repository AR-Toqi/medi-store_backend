"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const medicine_service_1 = require("../medicine/medicine.service");
const order_service_1 = require("../order/order.service");
const seller_service_1 = require("./seller.service");
const sellerProfile_service_1 = require("../sellerProfile/sellerProfile.service");
/**
 * Helper to get seller profile for the authenticated user via sellerService
 */
const getMySellerProfile = async (userId) => {
    return await seller_service_1.sellerService.getSellerProfileByUserId(userId);
};
// --- Dashboard & Analytics ---
const getDashboardStats = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const stats = await seller_service_1.sellerService.getDashboardStats(sellerProfile.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: stats,
    });
});
// --- Medicine Management ---
const createMedicine = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const medicine = await medicine_service_1.medicineService.createMedicineForSeller(sellerProfile.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Medicine created successfully",
        data: medicine,
    });
});
const getMyMedicines = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const search = req.query.search;
    const result = await medicine_service_1.medicineService.getMedicinesBySeller(sellerProfile.id, {
        page,
        limit,
        search,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicines fetched successfully",
        data: result.data,
    });
});
const getMedicineDetails = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const { slug } = req.params;
    const medicine = await medicine_service_1.medicineService.getMedicineDetailsBySeller(sellerProfile.id, slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicine details fetched successfully",
        data: medicine,
    });
});
const updateMedicine = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const { id } = req.params;
    const updatedMedicine = await medicine_service_1.medicineService.updateMedicineBySeller(sellerProfile.id, id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicine updated successfully",
        data: updatedMedicine,
    });
});
const deleteMedicine = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const { id } = req.params;
    await medicine_service_1.medicineService.deleteMedicineBySeller(sellerProfile.id, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Medicine deleted successfully",
        data: null,
    });
});
// --- Order Management ---
const getMyOrders = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const status = req.query.status;
    const search = req.query.search;
    const result = await order_service_1.orderService.getOrdersBySeller(sellerProfile.id, {
        page,
        limit,
        status,
        search,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders fetched successfully",
        data: result.data,
    });
});
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await getMySellerProfile(userId);
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await order_service_1.orderService.updateOrderStatus({
        orderId: id,
        status,
        userRole: req.user?.role,
        userId: sellerProfile.id,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order status updated successfully",
        data: updatedOrder,
    });
});
// --- Profile Management ---
const getProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const profile = await sellerProfile_service_1.sellerProfileService.getSellerProfile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile fetched successfully",
        data: profile,
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const updatedProfile = await sellerProfile_service_1.sellerProfileService.updateSellerProfile(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
    });
});
const deleteProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    await sellerProfile_service_1.sellerProfileService.deleteSellerProfile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile deleted successfully",
        data: null,
    });
});
exports.sellerController = {
    getDashboardStats,
    createMedicine,
    getMyMedicines,
    getMedicineDetails,
    updateMedicine,
    deleteMedicine,
    getMyOrders,
    updateOrderStatus,
    getProfile,
    updateProfile,
    deleteProfile,
};
//# sourceMappingURL=seller.controller.js.map