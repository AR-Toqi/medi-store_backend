import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { medicineService } from "./medicine.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";

/**
 * SELLER → Create medicine (for authenticated sellers)
 */
const createMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = req.body;
  const sellerId = req.user?.id;

  const medicine = await medicineService.createMedicineForSeller(sellerId as string, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Medicine created successfully",
    data: medicine,
  });
});

/**
 * PUBLIC → Get all medicines (with pagination and search)
 */
const getAllMedicines = catchAsync(async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string | undefined;

  const result = await medicineService.getAllMedicines({
    page,
    limit,
    ...(search && { search }),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicines fetched successfully",
    data: result.data,
  });
});

/**
 * SELLER → Get own medicines (with pagination and search)
 */
const getMedicinesBySeller = catchAsync(async (req: AuthRequest, res: Response) => {
  const sellerId = req.user?.id;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string | undefined;

  const result = await medicineService.getMedicinesBySeller(sellerId as string, {
    page,
    limit,
    ...(search && { search }),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your medicines fetched successfully",
    data: result.data,
  });
});

/**
 * PUBLIC → Get medicine details by slug
 */
const getMedicineDetails = catchAsync(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const medicine = await medicineService.getMedicineDetails(slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine details fetched successfully",
    data: medicine,
  });
});

/**
 * SELLER → Get medicine details by slug (own medicine only)
 */
const getMedicineDetailsBySeller = catchAsync(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;
  const sellerId = req.user?.id;

  const medicine = await medicineService.getMedicineDetailsBySeller(sellerId as string, slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine details fetched successfully",
    data: medicine,
  });
});

/**
 * SELLER → Update own medicine
 */
const updateMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const sellerId = req.user?.id;

  const updatedMedicine = await medicineService.updateMedicineBySeller(sellerId as string, id as string, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine updated successfully",
    data: updatedMedicine,
  });
});

/**
 * SELLER → Delete own medicine
 */
const deleteMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const sellerId = req.user?.id;

  const result = await medicineService.deleteMedicineBySeller(sellerId as string, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const medicineController = {
  createMedicine,
  getAllMedicines,
  getMedicinesBySeller,
  getMedicineDetails,
  getMedicineDetailsBySeller,
  updateMedicine,
  deleteMedicine,
};
