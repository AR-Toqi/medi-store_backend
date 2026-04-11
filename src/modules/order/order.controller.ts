import { Response } from "express";
import httpStatus from "http-status";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { orderService } from "./order.service";
import catchAsync from "../../app/errors/catchAsync";
import sendResponse from "../../app/utils/sendResponse";

/**
 * CUSTOMER → Create order
 */
const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const payload = req.body;
  const customerId = req.user?.id;

  const orderData = {
    ...payload,
    customerId,
  };

  const order = await orderService.createOrder(orderData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

/**
 * CUSTOMER → Get my orders
 */
const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;

  const result = await orderService.getCustomerOrders(customerId as string, {
    page,
    limit,
    status,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result.data,
  });
});

/**
 * ADMIN → Get all orders
 */
const getAllOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;
  const search = req.query.search as string;

  const result = await orderService.getAllOrders({
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

/**
 * SELLER → Get orders containing my medicines
 */
const getOrdersBySeller = catchAsync(async (req: AuthRequest, res: Response) => {
  const sellerId = req.user?.id;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const status = req.query.status as any;
  const search = req.query.search as string;

  const result = await orderService.getOrdersBySeller(sellerId as string, {
    page,
    limit,
    status,
    search,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your orders fetched successfully",
    data: result.data,
  });
});

/**
 * Get order details by ID (accessible by customer, seller, or admin)
 */
const getOrderDetails = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  // Get order details
  const order = await orderService.getOrderDetails(id as string);

  // Check permissions
  const isCustomer = order.customer.id === userId;
  const isSeller = order.items.some(item => item.medicine.seller.id === userId);
  const isAdmin = userRole === "ADMIN";

  if (!isCustomer && !isSeller && !isAdmin) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Access denied. You can only view your own orders or orders containing your medicines.",
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order details fetched successfully",
    data: order,
  });
});

/**
 * ADMIN/SELLER → Update order status
 */
const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  const payload = {
    orderId: id as string,
    status,
    userRole: userRole as any,
    userId: userId as string,
  };

  const updatedOrder = await orderService.updateOrderStatus(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder,
  });
});

/**
 * CUSTOMER → Checkout: create order from cart
 */
const checkout = catchAsync(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id as string;
  const payload = req.body; // { addressId, paymentMethod?, customerNote? }

  const order = await orderService.createOrderFromCart(customerId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created from cart successfully",
    data: order,
  });
});

export const orderController = {
  createOrder,
  checkout,
  getMyOrders,
  getAllOrders,
  getOrdersBySeller,
  getOrderDetails,
  updateOrderStatus,
};