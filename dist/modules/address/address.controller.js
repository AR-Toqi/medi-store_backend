"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const address_service_1 = require("./address.service");
/**
 * Create a new address
 */
const createAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await address_service_1.addressService.createAddress({
        ...req.body,
        userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Address created successfully",
        data: result,
    });
});
/**
 * Get all addresses of the user
 */
const getMyAddresses = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await address_service_1.addressService.getAddressesByUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Addresses fetched successfully",
        data: result,
    });
});
/**
 * Get single address by ID
 */
const getAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await address_service_1.addressService.getAddressById(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Address fetched successfully",
        data: result,
    });
});
/**
 * Update an existing address
 */
const updateAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await address_service_1.addressService.updateAddress({
        ...req.body,
        id: id,
        userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Address updated successfully",
        data: result,
    });
});
/**
 * Delete an address
 */
const deleteAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    await address_service_1.addressService.deleteAddress(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Address deleted successfully",
        data: null,
    });
});
/**
 * Set an address as default
 */
const setDefaultAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await address_service_1.addressService.setDefaultAddress(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Address set as default",
        data: result,
    });
});
exports.addressController = {
    createAddress,
    getMyAddresses,
    updateAddress,
    getAddress,
    deleteAddress,
    setDefaultAddress,
};
//# sourceMappingURL=address.controller.js.map