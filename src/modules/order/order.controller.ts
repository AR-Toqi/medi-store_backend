import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { orderService } from "./order.service";

/**
 * CUSTOMER → Create order
 */
const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;
    const customerId = req.user?.id;

    const orderData = {
      ...payload,
      customerId,
    };

    const order = await orderService.createOrder(orderData);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * CUSTOMER → Get my orders
 */
const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const status = req.query.status as any;

    const result = await orderService.getCustomerOrders(customerId as string, {
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * ADMIN → Get all orders
 */
const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
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

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * SELLER → Get orders containing my medicines
 */
const getOrdersBySeller = async (req: AuthRequest, res: Response) => {
  try {
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

    return res.status(200).json({
      success: true,
      message: "Your orders fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * Get order details by ID (accessible by customer, seller, or admin)
 */
const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
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
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own orders or orders containing your medicines.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Order not found",
    });
  }
};

/**
 * ADMIN/SELLER → Update order status
 */
const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
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

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

export const orderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrdersBySeller,
  getOrderDetails,
  updateOrderStatus,
};