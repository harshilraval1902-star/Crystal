import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  res.json(reviews);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!review) throw createError("Review not found.", 404);
  res.json(review);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    productId: number;
    customerName: string;
    rating: number;
    reviewText: string;
    status?: string;
  };

  if (!data.productId || !data.customerName || !data.rating || !data.reviewText) {
    throw createError("productId, customerName, rating, and reviewText are required.", 400);
  }

  const review = await prisma.review.create({
    data: {
      productId: data.productId,
      customerName: data.customerName,
      rating: data.rating,
      reviewText: data.reviewText,
      status: data.status ?? "pending",
    },
  });

  res.status(201).json(review);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Review not found.", 404);

  const updated = await prisma.review.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.review.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Review not found.", 404);

  await prisma.review.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
