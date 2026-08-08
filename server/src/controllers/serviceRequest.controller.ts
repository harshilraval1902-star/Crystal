import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isDeleted"];

function formatServiceRequest(request: any) {
  return mapBooleans(request, BOOLEAN_FIELDS);
}

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [requests] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM servicerequest WHERE isDeleted = ? ORDER BY createdAt DESC",
    [false]
  );
  res.json(requests.map(formatServiceRequest));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const [requests] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM servicerequest WHERE id = ? AND isDeleted = ? LIMIT 1",
    [Number(req.params.id), false]
  );
  const request = requests[0];
  if (!request) throw createError("Service request not found.", 404);
  res.json(formatServiceRequest(request));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    customerName: string;
    phone: string;
    email?: string;
    address?: string;
    serviceType?: string;
    message?: string;
    status?: string;
  };

  if (!data.customerName || !data.phone) {
    throw createError("customerName and phone are required.", 400);
  }

  const insertData = {
    customerName: data.customerName,
    phone: data.phone,
    email: data.email ?? null,
    address: data.address ?? null,
    serviceType: data.serviceType ?? null,
    message: data.message ?? null,
    status: data.status ?? "new",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO servicerequest (
      customerName, phone, email, address, serviceType, message, status, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.customerName, insertData.phone, insertData.email, insertData.address,
      insertData.serviceType, insertData.message, insertData.status, insertData.isDeleted,
      insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM servicerequest WHERE id = ?", [result.insertId]);
  res.status(201).json(formatServiceRequest(rows[0]));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM servicerequest WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Service request not found.", 404);

  const updateData = { ...req.body, updatedAt: new Date() };
  const queryParts = buildUpdateQuery("servicerequest", updateData);
  
  if (queryParts) {
    await pool.execute(
      `UPDATE servicerequest SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM servicerequest WHERE id = ?", [id]);
  res.json(formatServiceRequest(updatedRows[0]));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM servicerequest WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Service request not found.", 404);

  await pool.execute("UPDATE servicerequest SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
