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
import sharp from "sharp";
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

  try {
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    // Only optimize standard image formats
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      const buffer = await fsPromises.readFile(filePath);
      let sharpInstance = sharp(buffer);

      // Auto-orient based on EXIF and strip other metadata
      sharpInstance = sharpInstance.rotate();

      const metadata = await sharpInstance.metadata();
      const maxDimension = Number(process.env.MAX_IMAGE_DIMENSION ?? 4096);

      // Reject files exceeding maximum resolution limits
      if (metadata.width && metadata.height) {
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          await fsPromises.unlink(filePath).catch(() => {});
          res.status(400).json({
            success: false,
            message: `Image dimensions exceed the maximum allowed limit of ${maxDimension}x${maxDimension}px.`,
          });
          return;
        }
      }

      // Resize: max width 1920px (keep aspect ratio)
      if (metadata.width && metadata.width > 1920) {
        sharpInstance = sharpInstance.resize({
          width: 1920,
          withoutEnlargement: true,
        });
      }

      // Compress and convert transparent png safely
      if (ext === ".png") {
        sharpInstance = sharpInstance.png({ quality: 80, palette: true });
      } else if ([".jpg", ".jpeg"].includes(ext)) {
        sharpInstance = sharpInstance.jpeg({ quality: 80, progressive: true });
      } else if (ext === ".webp") {
        sharpInstance = sharpInstance.webp({ quality: 80 });
      }

      const optimizedBuffer = await sharpInstance.toBuffer();
      await fsPromises.writeFile(filePath, optimizedBuffer);
    }
  } catch (error) {
    console.error("Image optimization failed:", error);
    // Never break uploads: proceed even if optimization fails
  }

  next();
};

export { UPLOAD_DIR };
