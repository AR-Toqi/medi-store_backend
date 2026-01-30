export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  medicineId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  medicine: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsListResponse {
  reviews: ReviewResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}