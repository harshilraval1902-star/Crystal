import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  AuthRequest,
} from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

const REFRESH_TOKEN_TTL_DAYS = 7;

// POST /api/admin/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw createError("Email and password are required.", 400);
  }

  const [admins] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM admin WHERE email = ? LIMIT 1",
    [email]
  );
  const admin = admins[0];

  if (!admin || !admin.isActive) {
    throw createError("Invalid credentials.", 401);
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    throw createError("Invalid credentials.", 401);
  }

  const accessToken = generateAccessToken(admin.id, admin.role);
  const refreshToken = generateRefreshToken(admin.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  await pool.execute(
    "INSERT INTO refreshtoken (token, adminId, expiresAt, createdAt) VALUES (?, ?, ?, NOW())",
    [refreshToken, admin.id, expiresAt]
  );

  // Removed lastLogin update as the actual schema doesn't have it

  res.json({
    accessToken,
    refreshToken,
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// POST /api/admin/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken, allDevices } = req.body as { refreshToken?: string; allDevices?: boolean };

  if (refreshToken) {
    const [tokens] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM refreshtoken WHERE token = ? LIMIT 1",
      [refreshToken]
    );
    const stored = tokens[0];

    if (stored) {
      if (allDevices) {
        await pool.execute(
          "DELETE FROM refreshtoken WHERE adminId = ?",
          [stored.adminId]
        );
      } else {
        await pool.execute(
          "DELETE FROM refreshtoken WHERE id = ?",
          [stored.id]
        ).catch(() => {});
      }
    }
  }

  res.json({ message: "Logged out successfully." });
});

// POST /api/admin/auth/refresh
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    throw createError("Refresh token is required.", 400);
  }

  // Reuse Detection: Verify token against DB
  const [tokens] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM refreshtoken WHERE token = ? LIMIT 1",
    [refreshToken]
  );
  const stored = tokens[0];

  if (!stored) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { adminId: number };
      // Revoke all active sessions on token reuse detection (theft protection)
      await pool.execute(
        "DELETE FROM refreshtoken WHERE adminId = ?",
        [payload.adminId]
      );
      throw createError("Refresh token reuse detected. All sessions revoked.", 401);
    } catch (err: any) {
      if (err.statusCode === 401) throw err;
      throw createError("Invalid or expired refresh token.", 401);
    }
  }

  if (new Date(stored.expiresAt) < new Date()) {
    await pool.execute("DELETE FROM refreshtoken WHERE id = ?", [stored.id]).catch(() => {});
    throw createError("Invalid or expired refresh token.", 401);
  }

  const [admins] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM admin WHERE id = ? LIMIT 1",
    [stored.adminId]
  );
  const admin = admins[0];

  if (!admin || !admin.isActive) {
    throw createError("Admin not found or inactive.", 401);
  }

  const newAccessToken = generateAccessToken(admin.id, admin.role);
  const newRefreshToken = generateRefreshToken(admin.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  // Rotate refresh token
  await pool.execute("DELETE FROM refreshtoken WHERE id = ?", [stored.id]).catch(() => {});
  
  await pool.execute(
    "INSERT INTO refreshtoken (token, adminId, expiresAt, createdAt) VALUES (?, ?, ?, NOW())",
    [newRefreshToken, admin.id, expiresAt]
  );

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// GET /api/admin/auth/me
export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [admins] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM admin WHERE id = ? LIMIT 1",
    [req.adminId!]
  );
  const admin = admins[0];

  if (!admin) {
    throw createError("Admin not found.", 404);
  }

  res.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
});
