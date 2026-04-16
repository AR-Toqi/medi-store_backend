import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import httpStatus from "http-status";
import AppError from "../../app/errors/AppError";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary";

interface CreateCategoryPayload {
  name: string;
  image?: string;
  description?: string;
}

interface UpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
  image?: string;
  description?: string;
}

/**
 * Admin: Create a new category
 */
const createCategory = async (payload: CreateCategoryPayload) => {
  const slug = slugify(payload.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: payload.name }, { slug }],
    },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  return await prisma.category.create({
    data: { ...payload, slug },
  });
};

/**
 * Public/Admin: Get all categories
 */
const getAllCategories = async (isAdmin: boolean = false) => {
  return await prisma.category.findMany({
    // If not admin, only fetch active categories
    where: isAdmin ? {} : { isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  let updateData: any = { ...payload };

  if (payload.name) {
    const newSlug = slugify(payload.name);
    const slugExists = await prisma.category.findFirst({
      where: { slug: newSlug, NOT: { id } },
    });

    if (slugExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Category name already exists");
    }

    updateData.slug = newSlug;
  }

  if (payload.image) {
    // Delete old image if it exists
    if (category.image) {
      const publicId = extractPublicId(category.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }
  }

  return await prisma.category.update({
    where: { id },
    data: updateData,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const medicines = await prisma.medicine.findMany({
    where: { categoryId: id },
  });

  // 1. Delete all medicine images from Cloudinary
  for (const medicine of medicines) {
    if (medicine.imageUrl && !medicine.imageUrl.includes("placehold.co")) {
      const publicId = extractPublicId(medicine.imageUrl);
      if (publicId) await deleteFromCloudinary(publicId);
    }
  }

  // 2. Delete category image from Cloudinary
  if (category.image) {
    const publicId = extractPublicId(category.image);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  return await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
