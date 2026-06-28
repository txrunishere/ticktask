import { env } from "../config/env.config.js";

/**
 *
 * @param {Error & {isOperational: boolean; status: string; statusCode: number;}} err
 * @param {*} _
 * @param {Response} res
 * @param {*} _
 * @returns
 */
export const globalErrorHandler = (err, _req, res, _next) => {
  const error = { ...err };

  error.message = err.message;
  error.status = err.status || "error";
  error.statusCode = err.statusCode || 500;

  if (env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      message: error.message,
      status: error.status,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
