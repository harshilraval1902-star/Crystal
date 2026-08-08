import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isActive", "isDeleted"];

function formatFaq(faq: any) {
  return mapBooleans(faq, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [faqs] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM faq WHERE isDeleted = ? ORDER BY displayOrder ASC, createdAt DESC",
    [false]
  );
  res.json(faqs.map(formatFaq));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [faqs] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM faq WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const faq = faqs[0];
  if (!faq) throw createError("FAQ not found.", 404);
  res.json(formatFaq(faq));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.question || !data.answer) {
    throw createError("question and answer are required.", 400);
  }

  const insertData = {
    question: data.question,
    answer: data.answer,
    category: data.category ?? "General",
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO faq (
      question, answer, category, isActive, displayOrder, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.question, insertData.answer, insertData.category,
      insertData.isActive, insertData.displayOrder, insertData.isDeleted,
      insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM faq WHERE id = ?", [result.insertId]);
  res.status(201).json(formatFaq(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM faq WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("FAQ not found.", 404);

  const updateData = { ...req.body, updatedAt: new Date() };
  const queryParts = buildUpdateQuery("faq", updateData);
  
  if (queryParts) {
    await pool.execute(
      `UPDATE faq SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM faq WHERE id = ?", [id]);
  res.json(formatFaq(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM faq WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("FAQ not found.", 404);

  await pool.execute("UPDATE faq SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
