import { Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { addressService } from "./address.service";

/**
 * Create a new address
 */
const createAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const result = await addressService.createAddress({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Address created successfully",
    data: result,
  });
});

/**
 * Get all addresses of the user
 */
const getMyAddresses = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const result = await addressService.getAddressesByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Addresses fetched successfully",
    data: result,
  });
});

/**
 * Get single address by ID
 */
const getAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  const result = await addressService.getAddressById(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address fetched successfully",
    data: result,
  });
});

/**
 * Update an existing address
 */
const updateAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  const result = await addressService.updateAddress({
    ...req.body,
    id: id as string,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address updated successfully",
    data: result,
  });
});

/**
 * Delete an address
 */
const deleteAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  await addressService.deleteAddress(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address deleted successfully",
    data: null,
  });
});

/**
 * Set an address as default
 */
const setDefaultAddress = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { id } = req.params;

  const result = await addressService.setDefaultAddress(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Address set as default",
    data: result,
  });
});

export const addressController = {
  createAddress,
  getMyAddresses,
  updateAddress,
  getAddress,
  deleteAddress,
  setDefaultAddress,
};