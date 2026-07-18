import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
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

  const admin = await prisma.admin.findUnique({ where: { email } });
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

  await prisma.refreshToken.create({
    data: { token: refreshToken, adminId: admin.id, expiresAt },
  });

  // Log activity
  await prisma.activityLog.create({
    data: { adminId: admin.id, action: "LOGIN", entity: "Admin", entityId: admin.id },
  });

  res.json({
    accessToken,
    refreshToken,
    user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// POST /api/admin/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (refreshToken) {
    await prisma.refreshToken
      .delete({ where: { token: refreshToken } })
      .catch(() => {
        /* token may already not exist */
      });
  }

  res.json({ message: "Logged out successfully." });
});

// POST /api/admin/auth/refresh
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    throw createError("Refresh token is required.", 400);
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw createError("Invalid or expired refresh token.", 401);
  }

  const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
  if (!admin || !admin.isActive) {
    throw createError("Admin not found or inactive.", 401);
  }

  const newAccessToken = generateAccessToken(admin.id, admin.role);
  const newRefreshToken = generateRefreshToken(admin.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  // Rotate refresh token
  await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => {});
  await prisma.refreshToken.create({
    data: { token: newRefreshToken, adminId: admin.id, expiresAt },
  });

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// GET /api/admin/auth/me
export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.adminId } });
  if (!admin) {
    throw createError("Admin not found.", 404);
  }

  res.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
});
