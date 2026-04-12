"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const cartItem_service_1 = require("./cartItem.service");
/**
 * Add an item to the cart
 */
const addToCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await cartItem_service_1.cartItemService.addToCart({
        ...req.body,
        userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Item added to cart",
        data: result,
    });
});
/**
 * Get all cart items for the current user
 */
const getCartItems = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await cartItem_service_1.cartItemService.getCartItems(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cart fetched successfully",
        data: result.items,
        meta: result.summary,
    });
});
/**
 * Update quantity of a cart item
 */
const updateCartItemQuantity = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { medicineId } = req.params;
    const { quantity } = req.body;
    const result = await cartItem_service_1.cartItemService.updateCartItemQuantity(userId, medicineId, quantity);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cart updated successfully",
        data: result,
    });
});
/**
 * Remove an item from the cart
 */
const removeFromCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { medicineId } = req.params;
    await cartItem_service_1.cartItemService.removeFromCart(userId, medicineId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Item removed from cart",
        data: null,
    });
});
/**
 * Clear the entire cart
 */
const clearCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    await cartItem_service_1.cartItemService.clearCart(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cart cleared successfully",
        data: null,
    });
});
exports.cartItemController = {
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
};
//# sourceMappingURL=cartItem.controller.js.map