import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { reviewService } from "./reviews.service";

/**
 * CUSTOMER → Create a review for a purchased medicine
 */
const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const payload = req.body;

    const review = await reviewService.createReview(userId as string, payload);

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

/**
 * PUBLIC → Get all reviews for a specific medicine
 */
const getReviewsByMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await reviewService.getReviewsByMedicine(medicineId as string, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

/**
 * CUSTOMER → Get my own reviews
 */
const getMyReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await reviewService.getMyReviews(userId as string, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch reviews",
    });
  }
};

/**
 * CUSTOMER → Update my own review
 */
const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    const payload = req.body;

    const review = await reviewService.updateReview(reviewId as string, userId as string, payload);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

/**
 * CUSTOMER → Delete my own review
 */
const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    const result = await reviewService.deleteReview(reviewId as string, userId as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};

/**
 * PUBLIC → Get rating statistics for a medicine
 */
const getMedicineRatingStats = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;

    const stats = await reviewService.getMedicineRatingStats(medicineId as string);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch rating statistics",
    });
  }
};

export const reviewController = {
  createReview,
  getReviewsByMedicine,
  getMyReviews,
  updateReview,
  deleteReview,
  getMedicineRatingStats,
};