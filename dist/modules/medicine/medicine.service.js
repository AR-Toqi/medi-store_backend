"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicineService = exports.getMedicineDetailsBySeller = exports.deleteMedicineBySeller = exports.updateMedicineBySeller = exports.getMedicinesBySeller = exports.createMedicineForSeller = exports.getMedicineDetails = exports.getAllMedicines = void 0;
const prisma_1 = require("../../lib/prisma");
const slugify_1 = require("../../utils/slugify");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../app/errors/AppError"));
/**
 * Public: Get all medicines with advanced filtering
 */
const getAllMedicines = async (params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const search = params.search?.trim() || "";
    const { minPrice, maxPrice, categoryId, manufacturer, isFeatured } = params;
    const skip = (page - 1) * limit;
    // Build prisma where clause
    const where = {
        AND: []
    };
    // Search by name or description
    if (search) {
        where.AND.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
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
    if (where.AND.length === 0)
        delete where.AND;
    const [total, medicines] = await Promise.all([
        prisma_1.prisma.medicine.count({ where }),
        prisma_1.prisma.medicine.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { category: true },
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
exports.getAllMedicines = getAllMedicines;
/**
 * Public: Get medicine details
 */
const getMedicineDetails = async (slug) => {
    const medicine = await prisma_1.prisma.medicine.findFirst({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Medicine not found");
    }
    return { ...medicine, price: Number(medicine.price) };
};
exports.getMedicineDetails = getMedicineDetails;
/**
 * Seller/Admin: Create medicine
 */
const createMedicineForSeller = async (sellerId, payload) => {
    const seller = await prisma_1.prisma.sellerProfile.findUnique({ where: { id: sellerId } });
    if (!seller)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Seller profile not found");
    const category = await prisma_1.prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    const baseSlug = (0, slugify_1.slugify)(payload.name);
    if (!baseSlug)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid medicine name");
    let slug = baseSlug;
    let count = 1;
    while (await prisma_1.prisma.medicine.findFirst({ where: { slug } })) {
        slug = `${baseSlug}-${count++}`;
    }
    const medicine = await prisma_1.prisma.medicine.create({
        data: {
            name: payload.name,
            slug,
            description: payload.description || "",
            price: payload.price,
            stock: payload.stock,
            manufacturer: payload.manufacturer || "Unknown",
            categoryId: payload.categoryId,
            sellerId,
            isFeatured: payload.isFeatured || false,
        },
        include: { category: true },
    });
    return { ...medicine, price: Number(medicine.price) };
};
exports.createMedicineForSeller = createMedicineForSeller;
const getMedicinesBySeller = async (sellerId, params) => {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const search = params.search?.trim() || "";
    const { categoryId } = params;
    const skip = (page - 1) * limit;
    const where = {
        sellerId,
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } }
            ]
        }),
        ...(categoryId && { categoryId })
    };
    const [total, medicines] = await Promise.all([
        prisma_1.prisma.medicine.count({ where }),
        prisma_1.prisma.medicine.findMany({
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
exports.getMedicinesBySeller = getMedicinesBySeller;
const updateMedicineBySeller = async (sellerId, medicineId, payload) => {
    const medicine = await prisma_1.prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!medicine)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Medicine not found");
    if (medicine.sellerId !== sellerId)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized");
    if (payload.categoryId) {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: payload.categoryId } });
        if (!category)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    let slug = medicine.slug;
    if (payload.name) {
        const baseSlug = (0, slugify_1.slugify)(payload.name);
        slug = baseSlug;
        let count = 1;
        while (await prisma_1.prisma.medicine.findFirst({ where: { slug, id: { not: medicineId } } })) {
            slug = `${baseSlug}-${count++}`;
        }
    }
    // Build update data to avoid 'undefined' keys for strict TS
    const updateData = {};
    if (payload.name) {
        updateData.name = payload.name;
        updateData.slug = slug;
    }
    if (payload.description !== undefined)
        updateData.description = payload.description;
    if (payload.price !== undefined)
        updateData.price = payload.price;
    if (payload.stock !== undefined)
        updateData.stock = payload.stock;
    if (payload.manufacturer !== undefined)
        updateData.manufacturer = payload.manufacturer;
    if (payload.dosage !== undefined)
        updateData.dosage = payload.dosage;
    if (payload.categoryId !== undefined)
        updateData.categoryId = payload.categoryId;
    if (payload.isFeatured !== undefined)
        updateData.isFeatured = payload.isFeatured;
    const updated = await prisma_1.prisma.medicine.update({
        where: { id: medicineId },
        data: updateData,
        include: { category: true },
    });
    return { ...updated, price: Number(updated.price) };
};
exports.updateMedicineBySeller = updateMedicineBySeller;
const deleteMedicineBySeller = async (sellerId, medicineId) => {
    const medicine = await prisma_1.prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!medicine)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Medicine not found");
    if (medicine.sellerId !== sellerId)
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized");
    await prisma_1.prisma.medicine.delete({ where: { id: medicineId } });
    return { message: "Medicine deleted successfully" };
};
exports.deleteMedicineBySeller = deleteMedicineBySeller;
const getMedicineDetailsBySeller = async (sellerId, slug) => {
    const medicine = await prisma_1.prisma.medicine.findFirst({
        where: { slug, sellerId },
        include: { category: true, reviews: { include: { user: true } } }
    });
    if (!medicine)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Medicine not found");
    return { ...medicine, price: Number(medicine.price) };
};
exports.getMedicineDetailsBySeller = getMedicineDetailsBySeller;
exports.medicineService = {
    getAllMedicines: exports.getAllMedicines,
    getMedicineDetails: exports.getMedicineDetails,
    createMedicineForSeller: exports.createMedicineForSeller,
    getMedicinesBySeller: exports.getMedicinesBySeller,
    updateMedicineBySeller: exports.updateMedicineBySeller,
    deleteMedicineBySeller: exports.deleteMedicineBySeller,
    getMedicineDetailsBySeller: exports.getMedicineDetailsBySeller,
};
//# sourceMappingURL=medicine.service.js.map