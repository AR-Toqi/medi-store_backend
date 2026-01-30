import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

/**
 * Create a new review for a medicine
 * Validation: User must have purchased the medicine
 */
export const createReview = async (userId: string, payload: CreateReviewPayload) => {
  const { medicineId, rating, comment } = payload;

  // Validate rating is between 1-5
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // Check if user has purchased this medicine
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      medicineId,
      order: {
        customerId: userId,
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
    },
  });

  if (!hasPurchased) {
    throw new Error("You can only review medicines you have purchased");
  }

  // Check if user already reviewed this medicine
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      medicineId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }

  // Create the review
  const review = await prisma.review.create({
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

/**
 * Get all reviews for a specific medicine
 */
export const getReviewsByMedicine = async (medicineId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({
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

/**
 * Get user's own reviews
 */
export const getMyReviews = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
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
    prisma.review.count({
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

/**
 * Update a review (only by the review owner)
 */
export const updateReview = async (reviewId: string, userId: string, payload: UpdateReviewPayload) => {
  const { rating, comment } = payload;

  // Validate rating if provided
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!existingReview) {
    throw new Error("Review not found or you don't have permission to update it");
  }

  // Update the review
  const updatedReview = await prisma.review.update({
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

/**
 * Delete a review (only by the review owner)
 */
export const deleteReview = async (reviewId: string, userId: string) => {
  // Check if review exists and belongs to user
  const existingReview = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!existingReview) {
    throw new Error("Review not found or you don't have permission to delete it");
  }

  // Delete the review
  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

/**
 * Get average rating for a medicine
 */
export const getMedicineRatingStats = async (medicineId: string) => {
  const reviews = await prisma.review.findMany({
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
    dist[review.rating as keyof typeof dist] = (dist[review.rating as keyof typeof dist] || 0) + 1;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  return {
    averageRating,
    totalReviews: reviews.length,
    ratingDistribution,
  };
};

export const reviewService = {
  createReview,
  getReviewsByMedicine,
  getMyReviews,
  updateReview,
  deleteReview,
  getMedicineRatingStats,
};