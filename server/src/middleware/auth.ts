import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  adminId?: number;
  adminRole?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided." });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const secret = process.env.JWT_ACCESS_SECRET!;
    const payload = jwt.verify(token, secret) as { adminId: number; role: string };
    req.adminId = payload.adminId;
    req.adminRole = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.adminRole !== role) {
      res.status(403).json({ error: "Insufficient permissions." });
      return;
    }
    next();
  };
}

export function generateAccessToken(adminId: number, role: string): string {
  return jwt.sign(
    { adminId, role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES ?? "15m" } as jwt.SignOptions
  );
}

export function generateRefreshToken(adminId: number): string {
  return jwt.sign(
    { adminId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES ?? "7d" } as jwt.SignOptions
  );
}

export async function verifyRefreshToken(
  token: string
): Promise<{ adminId: number } | null> {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      adminId: number;
    };

    // Also verify it exists in the DB and is not expired
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
