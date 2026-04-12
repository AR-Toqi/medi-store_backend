"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
/**
 * USER → Get current logged-in user
 */
const getCurrentUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user?.id;
    const user = await user_service_1.userService.getCurrentUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});
/**
 * USER → Update own profile
 */
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;
    const updatedUser = await user_service_1.userService.updateUser(userId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully",
        data: updatedUser,
    });
});
exports.userController = {
    getCurrentUser,
    updateUser,
};
//# sourceMappingURL=user.controller.js.map