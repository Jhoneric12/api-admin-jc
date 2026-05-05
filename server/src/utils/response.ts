import type { Response } from "express";

interface SuccessResponseOptions<T> {
  res: Response;
  data: T;
  message: string;
  statusCode?: number;
}

interface ErrorInfo {
  code?: string;
  details?: unknown;
}

interface ErrorResponseOptions {
  res: Response;
  message: string;
  statusCode?: number;
  error?: ErrorInfo;
}

export const sendSuccess = <T>({ res, data, message, statusCode = 200 }: SuccessResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};

export const sendError = ({ res, message, statusCode = 500, error }: ErrorResponseOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(error && { error }),
  });
};
