import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error."
      : err.message ?? "Internal server error.";

  console.error(`[ERROR] ${err.stack ?? err.message}`);

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
