export interface CreateMedicineInput {
  name: string;
  categoryId: string;
  description?: string | undefined;
  price: number;
  stock: number;
  manufacturer?: string | undefined;
  dosage?: string | undefined;
  sellerId?: string | undefined;
  isFeatured?: boolean | undefined;
}

export interface UpdateMedicineInput {
  name?: string | undefined;
  categoryId?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  stock?: number | undefined;
  manufacturer?: string | undefined;
  dosage?: string | undefined;
  isFeatured?: boolean | undefined;
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
}

export interface MedicineParams {
  id: string;
}
