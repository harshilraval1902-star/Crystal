import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { getUploadUrl } from "../middleware/upload";
import { deleteUploadedFile } from "../utils/file";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isActive", "isDeleted"];

function formatGalleryImage(item: any) {
  return mapBooleans(item, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [items] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM galleryimage WHERE isDeleted = ? ORDER BY createdAt DESC",
    [false]
  );
  res.json(items.map(formatGalleryImage));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [items] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM galleryimage WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const item = items[0];
  if (!item) throw createError("Gallery image not found.", 404);
  res.json(formatGalleryImage(item));
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

  const insertData = {
    title: body.title.trim(),
    imageUrl,
    category: body.category?.trim() ?? "General",
    isActive: body.isActive !== false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO galleryimage (
      title, imageUrl, category, isActive, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.title, insertData.imageUrl, insertData.category,
      insertData.isActive, insertData.isDeleted, insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM galleryimage WHERE id = ?", [result.insertId]);
  res.status(201).json(formatGalleryImage(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM galleryimage WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  const existing = existingRows[0];
  if (!existing) throw createError("Gallery image not found.", 404);

  const body = req.body as { title?: string; category?: string; imageUrl?: string; isActive?: string | boolean };
  const file = req.file;

  let imageUrl = body.imageUrl;
  if (file) {
    imageUrl = getUploadUrl(req, file.filename);
    // Delete old file if it was a local upload
    await deleteUploadedFile(existing.imageUrl);
  }

  // Handle boolean conversion if form-data sends string
  let isActiveUpdate = body.isActive;
  if (typeof isActiveUpdate === "string") {
    isActiveUpdate = isActiveUpdate === "true";
  }

  const updateData: Record<string, any> = { updatedAt: new Date() };
  if (body.title !== undefined) updateData.title = body.title;
  if (body.category !== undefined) updateData.category = body.category;
  if (isActiveUpdate !== undefined) updateData.isActive = isActiveUpdate;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

  const queryParts = buildUpdateQuery("galleryimage", updateData);
  if (queryParts) {
    await pool.execute(
      `UPDATE galleryimage SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM galleryimage WHERE id = ?", [id]);
  res.json(formatGalleryImage(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM galleryimage WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  const existing = existingRows[0];
  if (!existing) throw createError("Gallery image not found.", 404);

  // Delete physical file if local
  await deleteUploadedFile(existing.imageUrl);

  await pool.execute("UPDATE galleryimage SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
