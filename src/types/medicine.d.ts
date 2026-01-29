export interface CreateMedicineInput {
  name: string;
  categoryId: string;
  description?: string;
  price: number;
  stock: number;
  manufacturer?: string;
  dosage?: string; // e.g. "500mg"
  sellerId?: string;
}


export interface UpdateMedicineInput {
  name?: string;
  categoryId?: string;

  description?: string;

  price?: number;
  stock?: number;

  manufacturer?: string;
  dosage?: string;
}

export interface MedicineQueryInput {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetMedicinesParams {
  page?: number;
  limit?: number;
  search?: string;
}
export interface MedicineParams {
  id: string;
}
