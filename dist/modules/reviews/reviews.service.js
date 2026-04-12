"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.getMedicineRatingStats = exports.deleteReview = exports.updateReview = exports.getMyReviews = exports.getReviewsByMedicine = exports.createReview = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_2 = require("../../../generated/prisma");
/**
 * Create a new review for a medicine
 * Validation: User must have purchased the medicine
 */
const createReview = async (userId, payload) => {
    const { medicineId, rating, comment } = payload;
    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }
    // Check if medicine exists
    const medicine = await prisma_1.prisma.medicine.findUnique({
        where: { id: medicineId },
    });
    if (!medicine) {
        throw new Error("Medicine not found");
    }
    // Check if user has purchased this medicine
    const hasPurchased = await prisma_1.prisma.orderItem.findFirst({
        where: {
            medicineId,
            order: {
                customerId: userId,
                status: {
                    not: prisma_2.OrderStatus.CANCELLED,
                },
            },
        },
    });
    if (!hasPurchased) {
        throw new Error("You can only review medicines you have purchased");
    }
    // Check if user already reviewed this medicine
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            userId,
            medicineId,
        },
    });
    if (existingReview) {
        throw new Error("You have already reviewed this medicine");
    }
    // Create the review
    const review = await prisma_1.prisma.review.create({
        data: {
            userId,
            medicineId,
            rating,
            comment: comment || "",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            medicine: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
    return review;
};
exports.createReview = createReview;
/**
 * Get all reviews for a specific medicine
 */
const getReviewsByMedicine = async (medicineId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
        prisma_1.prisma.review.findMany({
            where: { medicineId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.review.count({
            where: { medicineId },
        }),
    ]);
    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getReviewsByMedicine = getReviewsByMedicine;
/**
 * Get user's own reviews
 */
const getMyReviews = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
        prisma_1.prisma.review.findMany({
            where: { userId },
            include: {
                medicine: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        price: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.review.count({
            where: { userId },
        }),
    ]);
    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getMyReviews = getMyReviews;
/**
 * Update a review (only by the review owner)
 */
const updateReview = async (reviewId, userId, payload) => {
    const { rating, comment } = payload;
    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new Error("Rating must be between 1 and 5");
    }
    // Check if review exists and belongs to user
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            id: reviewId,
            userId,
        },
    });
    if (!existingReview) {
        throw new Error("Review not found or you don't have permission to update it");
    }
    // Update the review
    const updatedReview = await prisma_1.prisma.review.update({
        where: { id: reviewId },
        data: {
            ...(rating !== undefined && { rating }),
            ...(comment !== undefined && { comment }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            medicine: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
    return updatedReview;
};
exports.updateReview = updateReview;
/**
 * Delete a review (only by the review owner)
 */
const deleteReview = async (reviewId, userId) => {
    // Check if review exists and belongs to user
    const existingReview = await prisma_1.prisma.review.findFirst({
        where: {
            id: reviewId,
            userId,
        },
    });
    if (!existingReview) {
        throw new Error("Review not found or you don't have permission to delete it");
    }
    // Delete the review
    await prisma_1.prisma.review.delete({
        where: { id: reviewId },
    });
    return { message: "Review deleted successfully" };
};
exports.deleteReview = deleteReview;
/**
 * Get average rating for a medicine
 */
const getMedicineRatingStats = async (medicineId) => {
    const reviews = await prisma_1.prisma.review.findMany({
        where: { medicineId },
        select: { rating: true },
    });
    if (reviews.length === 0) {
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            },
        };
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / reviews.length).toFixed(1));
    const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1;
        return dist;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
    };
};
exports.getMedicineRatingStats = getMedicineRatingStats;
exports.reviewService = {
    createReview: exports.createReview,
    getReviewsByMedicine: exports.getReviewsByMedicine,
    getMyReviews: exports.getMyReviews,
    updateReview: exports.updateReview,
    deleteReview: exports.deleteReview,
    getMedicineRatingStats: exports.getMedicineRatingStats,
};
//# sourceMappingURL=reviews.service.js.map