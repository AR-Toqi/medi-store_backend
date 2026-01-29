import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";

interface CreateCategoryPayload {
  name: string;
}

interface UpdateCategoryPayload {
  name?: string;
  isActive?: boolean;
}

const createCategory = async (payload: CreateCategoryPayload) => {
  try {
    const slug = slugify(payload.name);

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: payload.name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    return await prisma.category.create({
      data: {
        name: payload.name,
        slug,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create category");
  }
};

const getAllCategories = async () => {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    throw new Error("Failed to fetch categories");
  }
};

const getSingleCategory = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch category");
  }
};

const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload
) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    let updateData: any = { ...payload };

    // If name is updated → regenerate slug
    if (payload.name) {
      const newSlug = slugify(payload.name);

      const slugExists = await prisma.category.findFirst({
        where: {
          slug: newSlug,
          NOT: { id },
        },
      });

      if (slugExists) {
        throw new Error("Category with this name already exists");
      }

      updateData.slug = newSlug;
    }

    return await prisma.category.update({
      where: { id },
      data: updateData,
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update category");
  }
};

const deleteCategory = async (id: string) => {
  try {
    // Check category existence
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Check if any medicine exists in this category
    const medicineCount = await prisma.medicine.count({
      where: { categoryId: id },
    });

    if (medicineCount > 0) {
      throw new Error(
        "Cannot delete category because medicines exist under this category"
      );
    }

    return await prisma.category.delete({
      where: { id },
    });

  } catch (error: any) {
    throw new Error(error.message || "Failed to delete category");
  }
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
