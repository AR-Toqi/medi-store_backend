import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import httpStatus from "http-status";
import AppError from "../../app/errors/AppError";

interface CreateCategoryPayload {
  name: string;
}

interface UpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
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
    data: { name: payload.name, slug },
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

  const medicineCount = await prisma.medicine.count({
    where: { categoryId: id },
  });

  if (medicineCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete category because medicines are linked to it. Try deactivating it instead."
    );
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
