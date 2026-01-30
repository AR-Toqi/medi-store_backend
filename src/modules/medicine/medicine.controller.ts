import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { medicineService } from "./medicine.service";

/**
 * SELLER → Create medicine (for authenticated sellers)
 */
const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const sellerId = req.user?.id;

    const medicine = await medicineService.createMedicineForSeller(sellerId as string, payload);

    return res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: medicine,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create medicine",
    });
  }
};

/**
 * PUBLIC → Get all medicines (with pagination and search)
 */
const getAllMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search as string | undefined;

    const result = await medicineService.getAllMedicines({
      page,
      limit,
      ...(search && { search }),
    });

    return res.status(200).json({
      success: true,
      message: "Medicines fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicines",
    });
  }
};

/**
 * SELLER → Get own medicines (with pagination and search)
 */
const getMedicinesBySeller = async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search as string | undefined;

    const result = await medicineService.getMedicinesBySeller(sellerId as string, {
      page,
      limit,
      ...(search && { search }),
    });

    return res.status(200).json({
      success: true,
      message: "Your medicines fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medicines",
    });
  }
};

/**
 * PUBLIC → Get medicine details by slug
 */
const getMedicineDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const medicine = await medicineService.getMedicineDetails(slug as string);

    return res.status(200).json({
      success: true,
      message: "Medicine details fetched successfully",
      data: medicine,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Medicine not found",
    });
  }
};

/**
 * SELLER → Get medicine details by slug (own medicine only)
 */
const getMedicineDetailsBySeller = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const sellerId = req.user?.id;

    const medicine = await medicineService.getMedicineDetailsBySeller(sellerId as string, slug as string);

    return res.status(200).json({
      success: true,
      message: "Medicine details fetched successfully",
      data: medicine,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Medicine not found",
    });
  }
};

/**
 * SELLER → Update own medicine
 */
const updateMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const sellerId = req.user?.id;

    const updatedMedicine = await medicineService.updateMedicineBySeller(sellerId as string, id as string, payload);

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update medicine",
    });
  }
};

/**
 * SELLER → Delete own medicine
 */
const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id;

    const result = await medicineService.deleteMedicineBySeller(sellerId as string, id as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Failed to delete medicine",
    });
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicines,
  getMedicinesBySeller,
  getMedicineDetails,
  getMedicineDetailsBySeller,
  updateMedicine,
  deleteMedicine,
};
