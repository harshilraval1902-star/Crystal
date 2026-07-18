import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await prisma.inquiry.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  res.json(inquiries);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const inquiry = await prisma.inquiry.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!inquiry) throw createError("Inquiry not found.", 404);
  res.json(inquiry);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!data.name || !data.phone) {
    throw createError("name and phone are required.", 400);
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  });

  res.status(201).json(inquiry);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.inquiry.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Inquiry not found.", 404);

  const updated = await prisma.inquiry.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.inquiry.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Inquiry not found.", 404);

  await prisma.inquiry.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
