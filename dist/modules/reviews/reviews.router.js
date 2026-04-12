"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const reviews_controller_1 = require("./reviews.controller");
const router = (0, express_1.Router)();
//* Public routes
router.get("/medicine/:medicineId", reviews_controller_1.reviewController.getReviewsByMedicine);
router.get("/medicine/:medicineId/stats", reviews_controller_1.reviewController.getMedicineRatingStats);
//* Customer routes (authenticated users)
router.post("/", auth_middleware_1.requireAuth, reviews_controller_1.reviewController.createReview);
router.get("/my-reviews", auth_middleware_1.requireAuth, reviews_controller_1.reviewController.getMyReviews);
router.put("/:reviewId", auth_middleware_1.requireAuth, reviews_controller_1.reviewController.updateReview);
router.delete("/:reviewId", auth_middleware_1.requireAuth, reviews_controller_1.reviewController.deleteReview);
exports.reviewRoutes = router;
//# sourceMappingURL=reviews.router.js.map