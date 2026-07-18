import { Request, Response, NextFunction } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wraps an async route handler and forwards any thrown errors to Express's
 * next() error pipeline, avoiding try/catch boilerplate in every controller.
 */
export const asyncHandler =
  (fn: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
