"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const order_service_1 = require("./order.service");
/**
 * CUSTOMER: Create a new order (Checkout)
 */
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const customerId = req.user?.id;
    const result = await order_service_1.orderService.createOrderFromCart(customerId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Order placed successfully",
        data: result,
    });
});
/**
 * CUSTOMER: Get my orders
 */
const getMyOrders = (0, catchAsync_1.default)(async (req, res) => {
    const customerId = req.user?.id;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const status = req.query.status;
    const result = await order_service_1.orderService.getCustomerOrders(customerId, {
        page,
        limit,
        status,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});
/**
 * CUSTOMER: Get order details
 */
const getOrderDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await order_service_1.orderService.getOrderDetails(id);
    // Verification: Ensure customer only sees their own order details
    if (result.customerId !== req.user?.id && req.user?.role !== "ADMIN") {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.FORBIDDEN,
            success: false,
            message: "Access denied",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order details fetched successfully",
        data: result,
    });
});
/**
 * CUSTOMER: Cancel order
 */
const cancelMyOrder = (0, catchAsync_1.default)(async (req, res) => {
    const customerId = req.user?.id;
    const { id } = req.params;
    const result = await order_service_1.orderService.cancelOrder(id, customerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order cancelled successfully",
        data: result,
    });
});
/**
 * ADMIN/SELLER: Update order status
 */
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;
    const result = await order_service_1.orderService.updateOrderStatus({
        orderId: id,
        status,
        userRole,
        userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});
exports.orderController = {
    createOrder,
    getMyOrders,
    getOrderDetails,
    cancelMyOrder,
    updateOrderStatus,
};
//# sourceMappingURL=order.controller.js.map