import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

// POST /api/admin/users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    throw createError("Missing required fields", 400);
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    throw createError("Email already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  res.status(201).json(newUser);
});

// PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  const user = await prisma.admin.findUnique({ where: { id: Number(id) } });
  if (!user) {
    throw createError("User not found", 404);
  }

  const updatedUser = await prisma.admin.update({
    where: { id: Number(id) },
    data: {
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
      status: status ?? user.status,
      isActive: status === "suspended" ? false : true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  res.json(updatedUser);
});

// DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.admin.findUnique({ where: { id: Number(id) } });
  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.role === "Super Admin") {
    const superAdminsCount = await prisma.admin.count({ where: { role: "Super Admin" } });
    if (superAdminsCount <= 1) {
      throw createError("Cannot delete the last Super Admin", 400);
    }
  }

  await prisma.admin.delete({ where: { id: Number(id) } });

  res.json({ message: "User deleted successfully" });
});
