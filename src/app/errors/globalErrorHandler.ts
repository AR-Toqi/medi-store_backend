import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Handle Prisma Errors
  if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = `Database Error: ${err.code}`;
  } else if (err.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Database Validation Error: Invalid data provided";
  }

  // Handle Multer Errors
  if (err.name === "MulterError") {
    statusCode = 400;
    message = `Upload Error: ${err.message}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error: err,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
