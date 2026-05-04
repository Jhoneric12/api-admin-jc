import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation failed",
      errors: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
    return;
  }

  logger.error("Unhandled error", err);
  res.status(500).json({ message: "Internal server error" });
};
