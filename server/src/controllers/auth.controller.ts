import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

  // Update lastLogin
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

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
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (stored) {
      if (allDevices) {
        await prisma.refreshToken.deleteMany({
          where: { adminId: stored.adminId }
        });
      } else {
        await prisma.refreshToken.delete({
          where: { id: stored.id }
        }).catch(() => {});
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
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { adminId: number };
      // Revoke all active sessions on token reuse detection (theft protection)
      await prisma.refreshToken.deleteMany({ where: { adminId: payload.adminId } });
      throw createError("Refresh token reuse detected. All sessions revoked.", 401);
    } catch (err: any) {
      if (err.statusCode === 401) throw err;
      throw createError("Invalid or expired refresh token.", 401);
    }
  }

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
    throw createError("Invalid or expired refresh token.", 401);
  }

  const admin = await prisma.admin.findUnique({ where: { id: stored.adminId } });
  if (!admin || !admin.isActive) {
    throw createError("Admin not found or inactive.", 401);
  }

  const newAccessToken = generateAccessToken(admin.id, admin.role);
  const newRefreshToken = generateRefreshToken(admin.id);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  // Rotate refresh token
  await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
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
