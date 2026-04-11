import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  if (err.message) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: err,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
