import { Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { medicineService } from "../medicine/medicine.service";
import { orderService } from "../order/order.service";
import { sellerService } from "./seller.service";
import { sellerProfileService } from "../sellerProfile/sellerProfile.service";

/**
 * Helper to get seller profile for the authenticated user via sellerService
 */
const getMySellerProfile = async (userId: string) => {
  return await sellerService.getSellerProfileByUserId(userId);
};

// --- Dashboard & Analytics ---

const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  
  const stats = await sellerService.getDashboardStats(sellerProfile.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: stats,
  });
});

// --- Medicine Management ---

const createMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  
  const medicine = await medicineService.createMedicineForSeller(sellerProfile.id, req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Medicine created successfully",
    data: medicine,
  });
});

const getMyMedicines = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const search = req.query.search as string;

  const result = await medicineService.getMedicinesBySeller(sellerProfile.id, {
    page,
    limit,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicines fetched successfully",
    data: result.data,
  });
});

const getMedicineDetails = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  const { slug } = req.params;

  const medicine = await medicineService.getMedicineDetailsBySeller(sellerProfile.id, slug as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine details fetched successfully",
    data: medicine,
  });
});

const updateMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  const { id } = req.params;

  const updatedMedicine = await medicineService.updateMedicineBySeller(
    sellerProfile.id,
    id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine updated successfully",
    data: updatedMedicine,
  });
});

const deleteMedicine = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  const { id } = req.params;

  await medicineService.deleteMedicineBySeller(sellerProfile.id, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Medicine deleted successfully",
    data: null,
  });
});

// --- Order Management ---

const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;
  const search = req.query.search as string;

  const result = await orderService.getOrdersBySeller(sellerProfile.id, {
    page,
    limit,
    status,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result.data,
  });
});

const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const sellerProfile = await getMySellerProfile(userId);
  const { id } = req.params;
  const { status } = req.body;

  const updatedOrder = await orderService.updateOrderStatus({
    orderId: id as string,
    status,
    userRole: req.user?.role as any,
    userId: sellerProfile.id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});

// --- Profile Management ---

const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const profile = await sellerProfileService.getSellerProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: profile,
  });
});

const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const updatedProfile = await sellerProfileService.updateSellerProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});

const deleteProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  await sellerProfileService.deleteSellerProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile deleted successfully",
    data: null,
  });
});

export const sellerController = {
  getDashboardStats,
  createMedicine,
  getMyMedicines,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
  getMyOrders,
  updateOrderStatus,
  getProfile,
  updateProfile,
  deleteProfile,
};
