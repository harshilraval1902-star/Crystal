import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import multer from "multer";

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.map((p) => String(p)).join("."),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  if (err instanceof multer.MulterError || err.message.startsWith("Only image files") || err.message.startsWith("Invalid file extension")) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const apiErr = err as ApiError;
  const statusCode = apiErr.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error."
      : apiErr.message ?? "Internal server error.";

  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode} - ${_req.method} ${_req.originalUrl || _req.url}`, apiErr);
  }

  res.status(statusCode).json({ error: message });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found." });
}

export function createError(message: string, statusCode: number): ApiError {
  const err = new Error(message) as ApiError;
  err.statusCode = statusCode;
  return err;
}
