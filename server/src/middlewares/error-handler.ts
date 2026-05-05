import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";
import { APIError } from "../utils/app-error.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    sendError({
      res,
      statusCode: 422,
      message: "Validation failed",
    });
    return;
  }

  if (err instanceof APIError && err.isOperational) {
    sendError({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  logger.error("Unhandled error", err);

  sendError({ res, statusCode: 500, message: "Internal server error" });
};
