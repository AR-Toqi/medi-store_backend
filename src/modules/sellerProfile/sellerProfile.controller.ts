import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sellerProfileService } from "./sellerProfile.service";

/**
 * USER → Create seller profile (become a seller)
 */
const createSellerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const userId = req.user?.id;

    const sellerProfileData = {
      ...payload,
      userId,
    };

    const sellerProfile = await sellerProfileService.createSellerProfile(sellerProfileData);

    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      data: sellerProfile,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create seller profile",
    });
  }
};

/**
 * SELLER → Get own seller profile
 */
const getSellerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const sellerProfile = await sellerProfileService.getSellerProfile(userId as string);

    return res.status(200).json({
      success: true,
      message: "Seller profile fetched successfully",
      data: sellerProfile,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Seller profile not found",
    });
  }
};

/**
 * SELLER → Update own seller profile
 */
const updateSellerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const userId = req.user?.id;

    const updatedProfile = await sellerProfileService.updateSellerProfile(userId as string, payload);

    return res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      data: updatedProfile,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update seller profile",
    });
  }
};

/**
 * SELLER → Delete own seller profile
 */
const deleteSellerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await sellerProfileService.deleteSellerProfile(userId as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete seller profile",
    });
  }
};

/**
 * ADMIN → Get all sellers
 */
const getAllSellers = async (req: AuthRequest, res: Response) => {
  try {
    const sellers = await sellerProfileService.getAllSellers();

    return res.status(200).json({
      success: true,
      message: "Sellers fetched successfully",
      data: sellers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sellers",
    });
  }
};

export const sellerProfileController = {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  deleteSellerProfile,
  getAllSellers,
}; 