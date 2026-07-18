import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

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
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

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
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)."));
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

export { UPLOAD_DIR };
