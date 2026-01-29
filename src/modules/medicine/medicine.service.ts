import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import type 
    { CreateMedicineInput, 
    UpdateMedicineInput, 
    MedicineQueryInput, 
    GetMedicinesParams } 
    from './../../types/medicine.d';


    export const createMedicine = async (payload: CreateMedicineInput) => {
  
    // 1. check category exists
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // 2. generate slug from name
    const baseSlug = slugify(payload.name);

    if (!baseSlug) {
      throw new Error("Invalid medicine name for slug generation");
    }

    // 3. ensure unique slug
    let slug = baseSlug;
    let count = 1;

    while (
      await prisma.medicine.findFirst({
        where: { slug },
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    // 4. create medicine
    const medicine = await prisma.medicine.create({
      data: {
        name: payload.name,
        slug,
        description: payload.description as string,
        price: payload.price,
        stock: payload.stock,
        manufacturer: payload.manufacturer || "Unknown",
        categoryId: payload.categoryId,
        sellerId: payload.sellerId || "", // Will be updated by controller/middleware
      },
      include: {
        category: true,
      },
    });

    return medicine;
  
};

export const getAllMedicines = async (params: GetMedicinesParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";

  const skip = (page - 1) * limit;

  // search condition
  const whereCondition: any = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive", // case-insensitive search
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  // get total count for pagination info
  const total = await prisma.medicine.count({
    where: whereCondition,
  });

  // get paginated data
  const medicines = await prisma.medicine.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc", // newest first
    },
    include: {
      category: true, // if you have relation with category
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: medicines,
  };
};

export const updateMedicine = async (
  id: string,
  payload: UpdateMedicineInput
) => {
  // 1. check medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // 2. if category is being updated, verify it exists
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  // 3. if name is being updated, regenerate slug
  let slug = medicine.slug;
  if (payload.name) {
    const baseSlug = slugify(payload.name);

    if (!baseSlug) {
      throw new Error("Invalid medicine name for slug generation");
    }

    // ensure unique slug (excluding current medicine)
    slug = baseSlug;
    let count = 1;

    while (
      await prisma.medicine.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }
  }

  // 4. update medicine
  const updatedMedicine = await prisma.medicine.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.name && { slug }),
      ...(payload.description && { description: payload.description }),
      ...(payload.price && { price: payload.price }),
      ...(payload.stock !== undefined && { stock: payload.stock }),
      ...(payload.manufacturer && { manufacturer: payload.manufacturer }),
      ...(payload.dosage && { dosageForm: payload.dosage }),
      ...(payload.categoryId && { categoryId: payload.categoryId }),
    },
    include: {
      category: true,
    },
  });

  return updatedMedicine;
};

export const deleteMedicine = async (id: string) => {
  // 1. check medicine exists
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  // 2. delete medicine
  await prisma.medicine.delete({
    where: { id },
  });

  return { message: "Medicine deleted successfully" };
};

export const getMedicineDetails = async (slug: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  return medicine;
};

export const medicineService = {
  createMedicine,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
  getMedicineDetails,
};
