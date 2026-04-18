import { Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { cartItemService } from "./cartItem.service";

/**
 * Add an item to the cart
 */
const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const result = await cartItemService.addToCart({
    ...req.body,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Item added to cart",
    data: result,
  });
});

/**
 * Get all cart items for the current user
 */
const getCartItems = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const result = await cartItemService.getCartItems(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart fetched successfully",
    data: {
      items: result.items,
      summary: result.summary
    },
  });
});

/**
 * Update quantity of a cart item
 */
const updateCartItemQuantity = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { medicineId } = req.params;
  const { quantity } = req.body;

  const result = await cartItemService.updateCartItemQuantity(
    userId,
    medicineId as string,
    quantity
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart updated successfully",
    data: result,
  });
});

/**
 * Remove an item from the cart
 */
const removeFromCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;
  const { medicineId } = req.params;

  await cartItemService.removeFromCart(userId, medicineId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Item removed from cart",
    data: null,
  });
});

/**
 * Clear the entire cart
 */
const clearCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id as string;

  await cartItemService.clearCart(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart cleared successfully",
    data: null,
  });
});

export const cartItemController = {
  addToCart,
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};