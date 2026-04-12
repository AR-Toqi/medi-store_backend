"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const reviews_service_1 = require("./reviews.service");
/**
 * CUSTOMER: Create a review for a medicine
 */
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await reviews_service_1.reviewService.createReview(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result,
    });
});
/**
 * PUBLIC: Get reviews for a medicine
 */
const getReviewsByMedicine = (0, catchAsync_1.default)(async (req, res) => {
    const { medicineId } = req.params;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await reviews_service_1.reviewService.getReviewsByMedicine(medicineId, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result.reviews,
        meta: result.pagination,
    });
});
/**
 * CUSTOMER: Get my own reviews
 */
const getMyReviews = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await reviews_service_1.reviewService.getMyReviews(userId, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your reviews fetched successfully",
        data: result.reviews,
        meta: result.pagination,
    });
});
/**
 * CUSTOMER: Update my review
 */
const updateReview = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await reviews_service_1.reviewService.updateReview(id, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
    });
});
/**
 * CUSTOMER: Delete my review
 */
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    await reviews_service_1.reviewService.deleteReview(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review deleted successfully",
        data: null,
    });
});
/**
 * PUBLIC: Get average rating stats for a medicine
 */
const getMedicineRatingStats = (0, catchAsync_1.default)(async (req, res) => {
    const { medicineId } = req.params;
    const result = await reviews_service_1.reviewService.getMedicineRatingStats(medicineId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Rating statistics fetched successfully",
        data: result,
    });
});
exports.reviewController = {
    createReview,
    getReviewsByMedicine,
    getMyReviews,
    updateReview,
    deleteReview,
    getMedicineRatingStats,
};
//# sourceMappingURL=reviews.controller.js.map