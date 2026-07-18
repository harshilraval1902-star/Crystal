import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await prisma.amcPlan.findMany({
    where: { isDeleted: false },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(plans);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const plan = await prisma.amcPlan.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!plan) throw createError("AMC plan not found.", 404);
  res.json(plan);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    name: string;
    price: string;
    durationMonths?: number;
    description?: string;
    serviceVisits?: number;
    sparePartsCovered?: boolean;
    prioritySupport?: boolean;
    badge?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.name || !data.price) {
    throw createError("name and price are required.", 400);
  }

  const plan = await prisma.amcPlan.create({
    data: {
      name: data.name,
      price: data.price,
      durationMonths: data.durationMonths ?? 12,
      description: data.description,
      serviceVisits: data.serviceVisits ?? 2,
      sparePartsCovered: data.sparePartsCovered ?? false,
      prioritySupport: data.prioritySupport ?? false,
      badge: data.badge,
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  res.status(201).json(plan);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.amcPlan.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("AMC plan not found.", 404);

  const updated = await prisma.amcPlan.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.amcPlan.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("AMC plan not found.", 404);

  await prisma.amcPlan.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
