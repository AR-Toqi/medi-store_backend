import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sellerProfileService } from "./sellerProfile.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { deleteFromCloudinary } from "../../utils/cloudinary";

/**
 * USER → Create seller profile (become a seller)
 */
const createSellerProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = req.body;
  const userId = req.user?.id;

  const sellerProfileData = {
    ...payload,
    userId,
  };

  if (req.file) {
    sellerProfileData.shopLogo = req.file.path;
  }

  try {
    const sellerProfile = await sellerProfileService.createSellerProfile(sellerProfileData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Seller profile created successfully",
      data: sellerProfile,
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    throw error;
  }
});

/**
 * SELLER → Get own seller profile
 */
const getSellerProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const sellerProfile = await sellerProfileService.getSellerProfile(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Seller profile fetched successfully",
    data: sellerProfile,
  });
});

/**
 * SELLER → Update own seller profile
 */
const updateSellerProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.shopLogo = req.file.path;
  }
  const userId = req.user?.id;

  try {
    const updatedProfile = await sellerProfileService.updateSellerProfile(userId as string, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Seller profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    throw error;
  }
});

/**
 * SELLER → Delete own seller profile
 */
const deleteSellerProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const result = await sellerProfileService.deleteSellerProfile(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

/**
 * ADMIN → Get all sellers
 */
const getAllSellers = catchAsync(async (req: AuthRequest, res: Response) => {
  const sellers = await sellerProfileService.getAllSellers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sellers fetched successfully",
    data: sellers,
  });
});

export const sellerProfileController = {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  deleteSellerProfile,
  getAllSellers,
};
 