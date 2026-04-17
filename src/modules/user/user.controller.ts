import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { userService } from "./user.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { deleteFromCloudinary } from "../../utils/cloudinary";

/**
 * USER → Get current logged-in user
 */
const getCurrentUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.user?.id;

  const user = await userService.getCurrentUser(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

/**
 * USER → Update own profile
 */
const updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  // Explicitly filter payload to allow only name and image
  const payload: any = {};
  if (req.body.name) payload.name = req.body.name;
  
  if (req.file) {
    payload.image = req.file.path;
  }
  try {
    const updatedUser = await userService.updateUser(userId, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.filename);
    }
    throw error;
  }
});

export const userController = {
  getCurrentUser,
  updateUser,
};