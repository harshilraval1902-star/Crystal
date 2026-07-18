import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const faqs = await prisma.faq.findMany({
    where: { isDeleted: false },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(faqs);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const faq = await prisma.faq.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!faq) throw createError("FAQ not found.", 404);
  res.json(faq);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.question || !data.answer) {
    throw createError("question and answer are required.", 400);
  }

  const faq = await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category ?? "General",
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  res.status(201).json(faq);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.faq.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("FAQ not found.", 404);

  const updated = await prisma.faq.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.faq.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("FAQ not found.", 404);

  await prisma.faq.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
