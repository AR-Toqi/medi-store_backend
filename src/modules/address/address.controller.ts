import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { addressService } from "./address.service";

/**
 * CUSTOMER → Create a new address
 */
const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const payload = req.body;

    const addressData = {
      ...payload,
      userId,
    };

    const address = await addressService.createAddress(addressData);

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create address",
    });
  }
};

/**
 * CUSTOMER → Get all addresses for current user
 */
const getMyAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const addresses = await addressService.getAddressesByUser(userId as string);

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch addresses",
    });
  }
};

/**
 * CUSTOMER → Get single address by ID (ownership check)
 */
const getAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const address = await addressService.getAddressById(id as string, userId);

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Address not found",
    });
  }
};

/**
 * CUSTOMER → Update address (ownership check)
 */
const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const payload = req.body;

    const updateData = {
      id,
      userId,
      ...payload,
    };

    const address = await addressService.updateAddress(updateData);

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update address",
    });
  }
};

/**
 * CUSTOMER → Delete address (ownership check)
 */
const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await addressService.deleteAddress(id as string, userId as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete address",
    });
  }
};

/**
 * CUSTOMER → Set address as default
 */
const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const address = await addressService.setDefaultAddress(id as string, userId as string);

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to set default address",
    });
  }
};

export const addressController = {
  createAddress,
  getMyAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};