import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR ?? "uploads"
);

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

import { NextFunction, Response } from "express";
import { promises as fsPromises } from "fs";

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

  if (!allowedExtensions.includes(ext) || !allowedMimes.includes(file.mimetype)) {
    cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)."));
  } else {
    cb(null, true);
  }
};

const maxFileSizeMB = Number(process.env.MAX_FILE_SIZE_MB ?? 5);

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024,
  },
});

export function getUploadUrl(req: Request, filename: string): string {
  const baseUrl =
    process.env.BASE_URL ??
    `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${filename}`;
}

export const optimizeImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  // Native image optimization removed to prevent Linux server crashes
  
  next();
};

export { UPLOAD_DIR };
