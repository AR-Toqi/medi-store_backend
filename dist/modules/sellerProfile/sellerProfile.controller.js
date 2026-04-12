"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerProfileController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sellerProfile_service_1 = require("./sellerProfile.service");
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
/**
 * USER → Create seller profile (become a seller)
 */
const createSellerProfile = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const sellerProfileData = {
        ...payload,
        userId,
    };
    const sellerProfile = await sellerProfile_service_1.sellerProfileService.createSellerProfile(sellerProfileData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Seller profile created successfully",
        data: sellerProfile,
    });
});
/**
 * SELLER → Get own seller profile
 */
const getSellerProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const sellerProfile = await sellerProfile_service_1.sellerProfileService.getSellerProfile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Seller profile fetched successfully",
        data: sellerProfile,
    });
});
/**
 * SELLER → Update own seller profile
 */
const updateSellerProfile = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    const updatedProfile = await sellerProfile_service_1.sellerProfileService.updateSellerProfile(userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Seller profile updated successfully",
        data: updatedProfile,
    });
});
/**
 * SELLER → Delete own seller profile
 */
const deleteSellerProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await sellerProfile_service_1.sellerProfileService.deleteSellerProfile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
/**
 * ADMIN → Get all sellers
 */
const getAllSellers = (0, catchAsync_1.default)(async (req, res) => {
    const sellers = await sellerProfile_service_1.sellerProfileService.getAllSellers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sellers fetched successfully",
        data: sellers,
    });
});
exports.sellerProfileController = {
    createSellerProfile,
    getSellerProfile,
    updateSellerProfile,
    deleteSellerProfile,
    getAllSellers,
};
//# sourceMappingURL=sellerProfile.controller.js.map