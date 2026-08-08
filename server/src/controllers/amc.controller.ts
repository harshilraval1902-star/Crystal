import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["sparePartsCovered", "prioritySupport", "isActive", "isDeleted"];

function formatAmcPlan(plan: any) {
  return mapBooleans(plan, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [plans] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM amcplan WHERE isDeleted = ? ORDER BY displayOrder ASC, createdAt DESC",
    [false]
  );
  res.json(plans.map(formatAmcPlan));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [plans] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM amcplan WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const plan = plans[0];
  if (!plan) throw createError("AMC plan not found.", 404);
  res.json(formatAmcPlan(plan));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    name: string;
    price: string;
    durationMonths?: number;
    description?: string;
    serviceVisits?: number;
    sparePartsCovered?: boolean;
    prioritySupport?: boolean;
    badge?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.name || !data.price) {
    throw createError("name and price are required.", 400);
  }

  const insertData = {
    name: data.name,
    price: data.price,
    durationMonths: data.durationMonths ?? 12,
    description: data.description ?? null,
    serviceVisits: data.serviceVisits ?? 2,
    sparePartsCovered: data.sparePartsCovered ?? false,
    prioritySupport: data.prioritySupport ?? false,
    badge: data.badge ?? null,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO amcplan (
      name, price, durationMonths, description, serviceVisits, 
      sparePartsCovered, prioritySupport, badge, isActive, 
      displayOrder, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.name, insertData.price, insertData.durationMonths, insertData.description,
      insertData.serviceVisits, insertData.sparePartsCovered, insertData.prioritySupport,
      insertData.badge, insertData.isActive, insertData.displayOrder, insertData.isDeleted,
      insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM amcplan WHERE id = ?", [result.insertId]);
  res.status(201).json(formatAmcPlan(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM amcplan WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("AMC plan not found.", 404);

  const updateData = { ...req.body, updatedAt: new Date() };
  const queryParts = buildUpdateQuery("amcplan", updateData);
  
  if (queryParts) {
    await pool.execute(
      `UPDATE amcplan SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM amcplan WHERE id = ?", [id]);
  res.json(formatAmcPlan(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM amcplan WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("AMC plan not found.", 404);

  await pool.execute("UPDATE amcplan SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
