import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { medicineService } from "./medicine.service";

/**
 * Public: Get all medicines with filters
 */
const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string;
  const categoryId = req.query.categoryId as string;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const manufacturer = req.query.manufacturer as string;
  const isFeatured = req.query.isFeatured as string;
  const sort = req.query.sort as string;

  const result = await medicineService.getAllMedicines({
    page,
    limit,
    search,
    categoryId,
    minPrice,
    maxPrice,
    manufacturer,
    isFeatured,
    sort,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicines fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

/**
 * Public: Get medicine details by slug
 */
const getMedicineDetails = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const medicine = await medicineService.getMedicineDetails(slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine details fetched successfully",
    data: medicine,
  });
});

export const medicineController = {
  getAllMedicines,
  getMedicineDetails,
};
