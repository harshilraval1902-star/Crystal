import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { getUploadUrl } from "../middleware/upload";

// POST /api/upload
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw createError("No file uploaded.", 400);
  }

  const url = getUploadUrl(req, req.file.filename);
  res.status(201).json({ url, filename: req.file.filename });
});
