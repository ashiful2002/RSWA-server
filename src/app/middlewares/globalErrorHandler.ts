import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err,
  });
};

export default globalErrorHandler;
