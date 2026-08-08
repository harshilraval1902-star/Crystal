import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/settings  — returns { key: value, ... }
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM setting");
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

// PUT /api/settings  — body: { key: value, ... }
export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as Record<string, string>;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    for (const [key, value] of Object.entries(data)) {
      await connection.execute(
        `INSERT INTO setting (\`key\`, value, createdAt, updatedAt) 
         VALUES (?, ?, NOW(), NOW()) 
         ON DUPLICATE KEY UPDATE value = ?, updatedAt = NOW()`,
        [key, String(value), String(value)]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM setting");
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }

  res.json(result);
});

// POST /api/settings — alias for update
export const create = update;
