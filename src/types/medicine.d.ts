export interface CreateMedicineInput {
  name: string;
  categoryId: string;
  description?: string | undefined;
  price: number;
  stock: number;
  manufacturer?: string | undefined;
  dosageForm?: string | undefined;
  sellerId?: string | undefined;
  isFeatured?: boolean | undefined;
  imageUrl?: string | undefined;
}

export interface UpdateMedicineInput {
  name?: string | undefined;
  categoryId?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  stock?: number | undefined;
  manufacturer?: string | undefined;
  dosageForm?: string | undefined;
  isFeatured?: boolean | undefined;
  imageUrl?: string | undefined;
}

export interface MedicineUpdateData extends UpdateMedicineInput {
  slug?: string | undefined;
}

export interface GetMedicinesParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  categoryId?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  manufacturer?: string | undefined;
  isFeatured?: boolean | string | undefined;
  sort?: string | undefined;
}

export interface MedicineParams {
  id: string;
}
