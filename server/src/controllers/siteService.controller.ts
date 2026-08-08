import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isActive", "isDeleted"];

function formatSiteService(service: any) {
  return mapBooleans(service, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [services] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM siteservice WHERE isDeleted = ? ORDER BY displayOrder ASC, createdAt DESC",
    [false]
  );
  res.json(services.map(formatSiteService));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [services] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM siteservice WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const service = services[0];
  if (!service) throw createError("Site service not found.", 404);
  res.json(formatSiteService(service));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    title: string;
    description: string;
    href: string;
    cta: string;
    icon?: string;
    accent?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.title || !data.description || !data.href || !data.cta) {
    throw createError("title, description, href, and cta are required.", 400);
  }

  const insertData = {
    title: data.title,
    description: data.description,
    href: data.href,
    cta: data.cta,
    icon: data.icon ?? null,
    accent: data.accent ?? null,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO siteservice (
      title, description, href, cta, icon, accent, isActive, displayOrder, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.title, insertData.description, insertData.href, insertData.cta,
      insertData.icon, insertData.accent, insertData.isActive, insertData.displayOrder,
      insertData.isDeleted, insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM siteservice WHERE id = ?", [result.insertId]);
  res.status(201).json(formatSiteService(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM siteservice WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Site service not found.", 404);

  const updateData = { ...req.body, updatedAt: new Date() };
  const queryParts = buildUpdateQuery("siteservice", updateData);
  
  if (queryParts) {
    await pool.execute(
      `UPDATE siteservice SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM siteservice WHERE id = ?", [id]);
  res.json(formatSiteService(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM siteservice WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Site service not found.", 404);

  await pool.execute("UPDATE siteservice SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
