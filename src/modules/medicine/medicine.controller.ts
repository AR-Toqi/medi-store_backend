import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { medicineService } from "./medicine.service";

/**
 * ADMIN/SELLER → Create medicine
 */
const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const userId = req.user?.id;

    // Add seller ID from authenticated user
    const medicineData = {
      ...payload,
      sellerId: userId,
    };

    const medicine = await medicineService.createMedicine(medicineData);

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
 * ADMIN/SELLER → Update medicine
 */
const updateMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updatedMedicine = await medicineService.updateMedicine(id as string, payload);

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
 * ADMIN/SELLER → Delete medicine
 */
const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await medicineService.deleteMedicine(id as string);

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
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
};
