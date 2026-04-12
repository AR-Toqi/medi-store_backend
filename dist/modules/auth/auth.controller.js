"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = __importDefault(require("../../app/errors/catchAsync"));
const sendResponse_1 = __importDefault(require("../../app/utils/sendResponse"));
const signUp = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.signUp(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const signIn = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.signIn(req.body);
    const { accessToken, refreshToken, user } = result;
    // Set tokens in httpOnly cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully logged in",
        data: {
            user,
            accessToken,
        },
    });
});
const signOut = (0, catchAsync_1.default)(async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.verifyEmail(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Email verified successfully",
        data: result,
    });
});
exports.authController = {
    signUp,
    signIn,
    signOut,
    verifyEmail,
};
//# sourceMappingURL=auth.controller.js.map