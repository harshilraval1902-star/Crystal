import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { getUploadUrl } from "../middleware/upload";
import path from "path";
import fs from "fs";
import { UPLOAD_DIR } from "../middleware/upload";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const items = await prisma.galleryImage.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  res.json(items);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.galleryImage.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!item) throw createError("Gallery image not found.", 404);
  res.json(item);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as { title?: string; category?: string; imageUrl?: string; isActive?: boolean };
  const file = req.file;

  let imageUrl = body.imageUrl?.trim();

  // If file was uploaded via multipart, use that
  if (file) {
    imageUrl = getUploadUrl(req, file.filename);
  }

  if (!body.title?.trim()) throw createError("title is required.", 400);
  if (!imageUrl) throw createError("An image file or imageUrl is required.", 400);

  const item = await prisma.galleryImage.create({
    data: {
      title: body.title.trim(),
      imageUrl,
      category: body.category?.trim() ?? "General",
      isActive: body.isActive !== false,
    },
  });

  res.status(201).json(item);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.galleryImage.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Gallery image not found.", 404);

  const body = req.body as { title?: string; category?: string; imageUrl?: string; isActive?: boolean };
  const file = req.file;

  let imageUrl = body.imageUrl;
  if (file) {
    imageUrl = getUploadUrl(req, file.filename);
    // Delete old file if it was a local upload
    if (existing.imageUrl.includes("/uploads/")) {
      const oldFile = path.join(UPLOAD_DIR, path.basename(existing.imageUrl));
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }
  }

  const updated = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });

  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.galleryImage.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Gallery image not found.", 404);

  // Delete physical file if local
  if (existing.imageUrl.includes("/uploads/")) {
    const filePath = path.join(UPLOAD_DIR, path.basename(existing.imageUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await prisma.galleryImage.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
