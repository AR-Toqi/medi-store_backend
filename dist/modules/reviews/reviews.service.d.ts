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
export declare const createReview: (userId: string, payload: CreateReviewPayload) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
    };
    medicine: {
        name: string;
        id: string;
        imageUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    userId: string;
    rating: number;
    comment: string;
    medicineId: string;
}>;
/**
 * Get all reviews for a specific medicine
 */
export declare const getReviewsByMedicine: (medicineId: string, page?: number, limit?: number) => Promise<{
    reviews: ({
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
/**
 * Get user's own reviews
 */
export declare const getMyReviews: (userId: string, page?: number, limit?: number) => Promise<{
    reviews: ({
        medicine: {
            name: string;
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
/**
 * Update a review (only by the review owner)
 */
export declare const updateReview: (reviewId: string, userId: string, payload: UpdateReviewPayload) => Promise<{
    user: {
        name: string;
        email: string;
        id: string;
    };
    medicine: {
        name: string;
        id: string;
        imageUrl: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    userId: string;
    rating: number;
    comment: string;
    medicineId: string;
}>;
/**
 * Delete a review (only by the review owner)
 */
export declare const deleteReview: (reviewId: string, userId: string) => Promise<{
    message: string;
}>;
/**
 * Get average rating for a medicine
 */
export declare const getMedicineRatingStats: (medicineId: string) => Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}>;
export declare const reviewService: {
    createReview: (userId: string, payload: CreateReviewPayload) => Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        medicine: {
            name: string;
            id: string;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    }>;
    getReviewsByMedicine: (medicineId: string, page?: number, limit?: number) => Promise<{
        reviews: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            comment: string;
            medicineId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyReviews: (userId: string, page?: number, limit?: number) => Promise<{
        reviews: ({
            medicine: {
                name: string;
                id: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                imageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            rating: number;
            comment: string;
            medicineId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateReview: (reviewId: string, userId: string, payload: UpdateReviewPayload) => Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        medicine: {
            name: string;
            id: string;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        rating: number;
        comment: string;
        medicineId: string;
    }>;
    deleteReview: (reviewId: string, userId: string) => Promise<{
        message: string;
    }>;
    getMedicineRatingStats: (medicineId: string) => Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
};
//# sourceMappingURL=reviews.service.d.ts.map