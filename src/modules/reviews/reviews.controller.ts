import { Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { reviewService } from "./reviews.service";

/**
 * CUSTOMER: Create a review for a medicine
 */
const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const result = await reviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

/**
 * PUBLIC: Get reviews for a medicine
 */
const getReviewsByMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const { medicineId } = req.params;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const result = await reviewService.getReviewsByMedicine(medicineId as string, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result.reviews,
    meta: result.pagination as any,
  });
});

/**
 * CUSTOMER: Get my own reviews
 */
const getMyReviews = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const result = await reviewService.getMyReviews(userId, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your reviews fetched successfully",
    data: result.reviews,
    meta: result.pagination as any,
  });
});

/**
 * CUSTOMER: Update my review
 */
const updateReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  const result = await reviewService.updateReview(id as string, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

/**
 * CUSTOMER: Delete my review
 */
const deleteReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  await reviewService.deleteReview(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    data: null,
  });
});

/**
 * PUBLIC: Get average rating stats for a medicine
 */
const getMedicineRatingStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const { medicineId } = req.params;
  const result = await reviewService.getMedicineRatingStats(medicineId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rating statistics fetched successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviewsByMedicine,
  getMyReviews,
  updateReview,
  deleteReview,
  getMedicineRatingStats,
};