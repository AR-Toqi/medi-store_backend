import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { reviewController } from "./reviews.controller";

const router = Router();

//* Public routes
router.get("/medicine/:medicineId", reviewController.getReviewsByMedicine);
router.get("/medicine/:medicineId/stats", reviewController.getMedicineRatingStats);

//* Customer routes (authenticated users)
router.post("/", requireAuth, reviewController.createReview);
router.get("/my-reviews", requireAuth, reviewController.getMyReviews);
router.put("/:reviewId", requireAuth, reviewController.updateReview);
router.delete("/:reviewId", requireAuth, reviewController.deleteReview);

export const reviewRoutes = router;