import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isDeleted: false },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(testimonials);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const item = await prisma.testimonial.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!item) throw createError("Testimonial not found.", 404);
  res.json(item);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    customerName: string;
    review: string;
    rating?: number;
    location?: string;
    designation?: string;
    photoUrl?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.customerName || !data.review) {
    throw createError("customerName and review are required.", 400);
  }

  const item = await prisma.testimonial.create({
    data: {
      customerName: data.customerName,
      review: data.review,
      rating: data.rating ?? 5,
      location: data.location,
      designation: data.designation,
      photoUrl: data.photoUrl,
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  res.status(201).json(item);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.testimonial.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Testimonial not found.", 404);

  const updated = await prisma.testimonial.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.testimonial.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Testimonial not found.", 404);

  await prisma.testimonial.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
