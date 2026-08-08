import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isDeleted"];

function formatInquiry(inquiry: any) {
  return mapBooleans(inquiry, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [inquiries] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM inquiry WHERE isDeleted = ? ORDER BY createdAt DESC",
    [false]
  );
  res.json(inquiries.map(formatInquiry));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [inquiries] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM inquiry WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const inquiry = inquiries[0];
  if (!inquiry) throw createError("Inquiry not found.", 404);
  res.json(formatInquiry(inquiry));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!data.name || !data.phone) {
    throw createError("name and phone are required.", 400);
  }

  const insertData = {
    name: data.name,
    phone: data.phone,
    email: data.email ?? null,
    subject: data.subject ?? null,
    message: data.message ?? null,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO inquiry (
      name, phone, email, subject, message, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.name, insertData.phone, insertData.email, insertData.subject,
      insertData.message, insertData.isDeleted, insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM inquiry WHERE id = ?", [result.insertId]);
  res.status(201).json(formatInquiry(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM inquiry WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Inquiry not found.", 404);

  const updateData = { ...req.body, updatedAt: new Date() };
  const queryParts = buildUpdateQuery("inquiry", updateData);
  
  if (queryParts) {
    await pool.execute(
      `UPDATE inquiry SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM inquiry WHERE id = ?", [id]);
  res.json(formatInquiry(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM inquiry WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Inquiry not found.", 404);

  await pool.execute("UPDATE inquiry SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
