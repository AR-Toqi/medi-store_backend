"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const prisma_1 = require("../../lib/prisma");
const slugify_1 = require("../../utils/slugify");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
/**
 * Admin: Create a new category
 */
const createCategory = async (payload) => {
    const slug = (0, slugify_1.slugify)(payload.name);
    const existingCategory = await prisma_1.prisma.category.findFirst({
        where: {
            OR: [{ name: payload.name }, { slug }],
        },
    });
    if (existingCategory) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists");
    }
    return await prisma_1.prisma.category.create({
        data: { name: payload.name, slug },
    });
};
/**
 * Public/Admin: Get all categories
 */
const getAllCategories = async (isAdmin = false) => {
    return await prisma_1.prisma.category.findMany({
        // If not admin, only fetch active categories
        where: isAdmin ? {} : { isActive: true },
        orderBy: { createdAt: "desc" },
    });
};
const getSingleCategory = async (id) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: { id },
    });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
};
const updateCategory = async (id, payload) => {
    const category = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    let updateData = { ...payload };
    if (payload.name) {
        const newSlug = (0, slugify_1.slugify)(payload.name);
        const slugExists = await prisma_1.prisma.category.findFirst({
            where: { slug: newSlug, NOT: { id } },
        });
        if (slugExists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Category name already exists");
        }
        updateData.slug = newSlug;
    }
    return await prisma_1.prisma.category.update({
        where: { id },
        data: updateData,
    });
};
const deleteCategory = async (id) => {
    const category = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    const medicineCount = await prisma_1.prisma.medicine.count({
        where: { categoryId: id },
    });
    if (medicineCount > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete category because medicines are linked to it. Try deactivating it instead.");
    }
    return await prisma_1.prisma.category.delete({ where: { id } });
};
exports.categoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
//# sourceMappingURL=categories.service.js.map