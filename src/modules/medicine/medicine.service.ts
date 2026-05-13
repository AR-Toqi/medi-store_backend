import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import type { CreateMedicineInput, UpdateMedicineInput, GetMedicinesParams, MedicineUpdateData } from '../../types/medicine.d';
import httpStatus from "http-status";
import AppError from "../../app/errors/AppError";
import { generateEmbedding } from "../../lib/embeddings";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary";
 
const DEFAULT_MEDICINE_IMAGE = "https://placehold.co/600x400/00bfa5/ffffff?text=Medicine+Image";

/**
 * Public: Get all medicines with advanced filtering
 */
export const getAllMedicines = async (params: GetMedicinesParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";
  const { minPrice, maxPrice, categoryId, manufacturer, isFeatured } = params;

  const skip = (page - 1) * limit;

  // Build prisma where clause
  const where: any = {
    AND: []
  };

  // Search by name or description
  if (search) {
    where.AND.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } }
      ]
    });
  }

  // Filter by Category
  if (categoryId) {
    where.AND.push({ categoryId });
  }

  // Filter by Price Range
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.AND.push({
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      }
    });
  }

  // Filter by Manufacturer
  if (manufacturer) {
    where.AND.push({ manufacturer: { contains: manufacturer, mode: "insensitive" } });
  }

  // Filter by Featured
  if (isFeatured !== undefined) {
    where.AND.push({ isFeatured: isFeatured === 'true' || isFeatured === true });
  }

  // Remove empty AND if no filters were applied
  if (where.AND.length === 0) delete where.AND;

  // Build prisma order by clause
  let orderBy: any = { createdAt: "desc" };
  if (params.sort) {
    switch (params.sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
    }
  }

  const [total, medicines] = await Promise.all([
    prisma.medicine.count({ where }),
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { 
        category: true,
        seller: {
          select: { shopName: true }
        }
      },
    })
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: medicines.map(m => ({ ...m, price: Number(m.price) })),
  };
};

/**
 * Public: Get medicine details
 */
export const getMedicineDetails = async (slug: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      seller: {
        select: {
          id: true,
          shopName: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!medicine) {
    throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  }

  return { ...medicine, price: Number(medicine.price) };
};

/**
 * Seller/Admin: Create medicine
 */
export const createMedicineForSeller = async (sellerId: string, payload: CreateMedicineInput) => {
  const seller = await prisma.sellerProfile.findUnique({ where: { id: sellerId } });
  if (!seller) throw new AppError(httpStatus.NOT_FOUND, "Seller profile not found");

  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");

  const baseSlug = slugify(payload.name);
  if (!baseSlug) throw new AppError(httpStatus.BAD_REQUEST, "Invalid medicine name");

  let slug = baseSlug;
  let count = 1;
  while (await prisma.medicine.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  const medicine = await prisma.medicine.create({
    data: {
      name: payload.name,
      slug,
      description: payload.description || "",
      price: Number(payload.price),
      stock: Number(payload.stock),
      manufacturer: payload.manufacturer || "Unknown",
      dosageForm: payload.dosageForm || "",
      categoryId: payload.categoryId,
      sellerId,
      isFeatured: String(payload.isFeatured) === "true",
      imageUrl: payload.imageUrl || DEFAULT_MEDICINE_IMAGE,
    },
    include: { category: true },
  });

  // Generate vector asynchronously so it doesn't slow down the response
  // but we do it before returning so the user knows it's happening
  try {
    const prompt = `title: ${medicine.name} | description: ${medicine.description || ""} | manufacturer: ${medicine.manufacturer}`;
    const vector = await generateEmbedding(prompt, { 
      taskType: "search_document",
      title: medicine.name 
    });
    
    const vectorString = `[${vector.join(",")}]`;
    await prisma.$executeRawUnsafe(`
      UPDATE "Medicine"
      SET vector = '${vectorString}'::vector
      WHERE id = '${medicine.id}'
    `);
  } catch (err) {
    console.error(`Failed to generate vector for ${medicine.name}:`, err);
  }

  return { ...medicine, price: Number(medicine.price) };
};

export const getMedicinesBySeller = async (sellerId: string, params: GetMedicinesParams) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim() || "";
  const { categoryId } = params;

  const skip = (page - 1) * limit;
  const where: any = {
    sellerId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } }
      ]
    }),
    ...(categoryId && { categoryId })
  };

  const [total, medicines] = await Promise.all([
    prisma.medicine.count({ where }),
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    })
  ]);

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: medicines.map(m => ({ ...m, price: Number(m.price) })),
  };
};

export const updateMedicineBySeller = async (sellerId: string, medicineId: string, payload: UpdateMedicineInput) => {
  const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!medicine) throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  if (medicine.sellerId !== sellerId) throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  let slug = medicine.slug;
  if (payload.name) {
    const baseSlug = slugify(payload.name);
    slug = baseSlug;
    let count = 1;
    while (await prisma.medicine.findFirst({ where: { slug, id: { not: medicineId } } })) {
      slug = `${baseSlug}-${count++}`;
    }
  }

  // Build update data to avoid 'undefined' keys for strict TS
  const updateData: MedicineUpdateData = {};
  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = slug;
  }
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.price !== undefined) updateData.price = Number(payload.price);
  if (payload.stock !== undefined) updateData.stock = Number(payload.stock);
  if (payload.manufacturer !== undefined) updateData.manufacturer = payload.manufacturer;
  if (payload.dosageForm !== undefined) updateData.dosageForm = payload.dosageForm;
  if (payload.categoryId !== undefined) updateData.categoryId = payload.categoryId;
  if (payload.isFeatured !== undefined) updateData.isFeatured = String(payload.isFeatured) === "true";
  
  if (payload.imageUrl !== undefined) {
    (updateData as any).imageUrl = payload.imageUrl;
    // Delete old image if it exists and is different from default
    if (medicine.imageUrl && !medicine.imageUrl.includes("placehold.co")) {
      const publicId = extractPublicId(medicine.imageUrl);
      if (publicId) await deleteFromCloudinary(publicId);
    }
  }

  const updated = await prisma.medicine.update({
    where: { id: medicineId },
    data: updateData as any,
    include: { category: true },
  });

  // Update vector if relevant fields changed
  if (payload.name || payload.description !== undefined || payload.manufacturer !== undefined) {
    try {
      const prompt = `title: ${updated.name} | description: ${updated.description || ""} | manufacturer: ${updated.manufacturer}`;
      const vector = await generateEmbedding(prompt, { 
        taskType: "search_document",
        title: updated.name 
      });
      
      const vectorString = `[${vector.join(",")}]`;
      await prisma.$executeRawUnsafe(`
        UPDATE "Medicine"
        SET vector = '${vectorString}'::vector
        WHERE id = '${updated.id}'
      `);
    } catch (err) {
      console.error(`Failed to update vector for ${updated.name}:`, err);
    }
  }

  return { ...updated, price: Number(updated.price) };
};

export const deleteMedicineBySeller = async (sellerId: string, medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!medicine) throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  if (medicine.sellerId !== sellerId) throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");

  if (medicine.imageUrl && !medicine.imageUrl.includes("placehold.co")) {
    const publicId = extractPublicId(medicine.imageUrl);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  await prisma.medicine.delete({ where: { id: medicineId } });
  return { message: "Medicine deleted successfully" };
};

export const toggleMedicineFeatured = async (sellerId: string, medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!medicine) throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  if (medicine.sellerId !== sellerId) throw new AppError(httpStatus.FORBIDDEN, "Unauthorized");

  const updated = await prisma.medicine.update({
    where: { id: medicineId },
    data: { isFeatured: !medicine.isFeatured },
    include: { category: true }
  });

  return { ...updated, price: Number(updated.price) };
};

export const getMedicineDetailsBySeller = async (sellerId: string, slug: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { slug, sellerId },
    include: { category: true, reviews: { include: { user: true } } }
  });

  if (!medicine) throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  return { ...medicine, price: Number(medicine.price) };
};

export const getMedicineByIdBySeller = async (sellerId: string, id: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, sellerId },
    include: { category: true, reviews: { include: { user: true } } }
  });

  if (!medicine) throw new AppError(httpStatus.NOT_FOUND, "Medicine not found");
  return { ...medicine, price: Number(medicine.price) };
};

export const medicineService = {
  getAllMedicines,
  getMedicineDetails,
  createMedicineForSeller,
  getMedicinesBySeller,
  updateMedicineBySeller,
  deleteMedicineBySeller,
  toggleMedicineFeatured,
  getMedicineDetailsBySeller,
  getMedicineByIdBySeller,
};
