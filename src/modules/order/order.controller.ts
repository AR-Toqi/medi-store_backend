import { Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { orderService } from "./order.service";

/**
 * CUSTOMER: Create a new order (Checkout)
 */
const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id as string;
  const result = await orderService.createOrderFromCart(customerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

/**
 * CUSTOMER: Get my orders
 */
const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id as string;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;

  const result = await orderService.getCustomerOrders(customerId, {
    page,
    limit,
    status,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

/**
 * CUSTOMER: Get order details
 */
const getOrderDetails = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const result = await orderService.getOrderDetails(id as string);

  // Verification: Ensure customer only sees their own order details
  if (result.customerId !== req.user?.id && req.user?.role !== "ADMIN") {
    sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      success: false,
      message: "Access denied",
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order details fetched successfully",
    data: result,
  });
});

/**
 * CUSTOMER: Cancel order
 */
const cancelMyOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id as string;
  const { id } = req.params;

  const result = await orderService.cancelOrder(id as string, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order cancelled successfully",
    data: result,
  });
});

/**
 * ADMIN/SELLER: Update order status
 */
const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userRole = req.user?.role as any;
  const userId = req.user?.id as string;

  const result = await orderService.updateOrderStatus({
    orderId: id as string,
    status,
    userRole,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const orderController = {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelMyOrder,
  updateOrderStatus,
};