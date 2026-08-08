import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["isActive"];

function formatUser(user: any) {
  return mapBooleans(user, BOOLEAN_FIELDS);
}

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const [users] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, role, isActive, createdAt FROM admin ORDER BY createdAt DESC"
  );
  // Add mock status and lastLogin for API compatibility
  const formattedUsers = users.map(user => {
    const formatted = formatUser(user);
    return {
      ...formatted,
      status: formatted.isActive ? "active" : "suspended",
      lastLogin: null
    };
  });
  res.json(formattedUsers);
});

// POST /api/admin/users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    throw createError("Missing required fields", 400);
  }

  const [existing] = await pool.query<RowDataPacket[]>("SELECT id FROM admin WHERE email = ? LIMIT 1", [email]);
  if (existing[0]) {
    throw createError("Email already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const insertData = {
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
    createdAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO admin (
      name, email, password, role, isActive, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      insertData.name, insertData.email, insertData.password, insertData.role,
      insertData.isActive, insertData.createdAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, role, isActive, createdAt FROM admin WHERE id = ?",
    [result.insertId]
  );
  const newUser = {
    ...formatUser(rows[0]),
    status: rows[0].isActive ? "active" : "suspended",
    lastLogin: null
  };
  res.status(201).json(newUser);
});

// PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, role, status } = req.body;

  const [userRows] = await pool.query<RowDataPacket[]>("SELECT * FROM admin WHERE id = ? LIMIT 1", [id]);
  const user = userRows[0];
  if (!user) {
    throw createError("User not found", 404);
  }

  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (role !== undefined) updateData.role = role;
  if (status !== undefined) {
    updateData.isActive = status === "suspended" ? false : true;
  }

  const queryParts = buildUpdateQuery("admin", updateData);
  if (queryParts) {
    await pool.execute(
      `UPDATE admin SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, role, isActive, createdAt FROM admin WHERE id = ?",
    [id]
  );
  
  const updatedUser = {
    ...formatUser(updatedRows[0]),
    status: updatedRows[0].isActive ? "active" : "suspended",
    lastLogin: null
  };
  res.json(updatedUser);
});

// DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const [userRows] = await pool.query<RowDataPacket[]>("SELECT * FROM admin WHERE id = ? LIMIT 1", [id]);
  const user = userRows[0];
  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.role === "Super Admin") {
    const [superAdminsCountRows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM admin WHERE role = 'Super Admin'"
    );
    const superAdminsCount = superAdminsCountRows[0].count;
    if (superAdminsCount <= 1) {
      throw createError("Cannot delete the last Super Admin", 400);
    }
  }

  // Deleting user manually handling relation constraints
  await pool.execute("DELETE FROM refreshtoken WHERE adminId = ?", [id]).catch(() => {});
  await pool.execute("UPDATE activitylog SET adminId = NULL WHERE adminId = ?", [id]).catch(() => {});
  await pool.execute("DELETE FROM admin WHERE id = ?", [id]);

  res.json({ message: "User deleted successfully" });
});
