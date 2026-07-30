import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { asyncHandler } from "../utils/asyncHandler";

export const validateBody = (schema: ZodSchema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.map(p => String(p)).join("."),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
        return;
      }
      next(error);
    }
  });
