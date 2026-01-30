import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { cartItemService } from "./cartItem.service";

/**
 * CUSTOMER → Add item to cart
 */
const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId, quantity } = req.body;
    const userId = req.user?.id;

    const cartItem = await cartItemService.addToCart({
      userId: userId as string,
      medicineId,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add item to cart",
    });
  }
};

/**
 * CUSTOMER → Get cart items
 */
const getCartItems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const cart = await cartItemService.getCartItems(userId as string);

    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart items",
    });
  }
};

/**
 * CUSTOMER → Update cart item quantity
 */
const updateCartItemQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    const updatedCartItem = await cartItemService.updateCartItemQuantity(
      userId as string,
      medicineId as string,
      quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: updatedCartItem,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update cart item quantity",
    });
  }
};

/**
 * CUSTOMER → Remove item from cart
 */
const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId } = req.params;
    const userId = req.user?.id;

    const result = await cartItemService.removeFromCart(userId as string, medicineId as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Failed to remove item from cart",
    });
  }
};

/**
 * CUSTOMER → Clear entire cart
 */
const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await cartItemService.clearCart(userId as string);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};

export const cartItemController = {
  addToCart,
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};