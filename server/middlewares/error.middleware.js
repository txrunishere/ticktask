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
    if (error?.errors?.title.name === "ValidatorError") {
      return res.status(error.statusCode).json({
        message: "Invalid input",
        status: error.status,
        stack: err.stack,
        error,
      });
    }

    if (error?.kind === "ObjectId") {
      return res.status(error.statusCode).json({
        message: "Invalid ObjectId",
        status: error.status,
        stack: err.stack,
        error,
      });
    }

    return res.status(error.statusCode).json({
      message: error.message,
      status: error.status,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    if (error?.errors?.title.name === "ValidatorError") {
      return res.status(error.statusCode).json({
        message: "Invalid input",
        status: error.status,
      });
    }

    if (error?.kind === "ObjectId") {
      return res.status(error.statusCode).json({
        message: "Invalid ObjectId",
        status: error.status,
      });
    }

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
