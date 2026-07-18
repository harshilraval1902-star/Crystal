import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const services = await prisma.siteService.findMany({
    where: { isDeleted: false },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  res.json(services);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.siteService.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!service) throw createError("Site service not found.", 404);
  res.json(service);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    title: string;
    description: string;
    href: string;
    cta: string;
    icon?: string;
    accent?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.title || !data.description || !data.href || !data.cta) {
    throw createError("title, description, href, and cta are required.", 400);
  }

  const service = await prisma.siteService.create({
    data: {
      title: data.title,
      description: data.description,
      href: data.href,
      cta: data.cta,
      icon: data.icon,
      accent: data.accent,
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  res.status(201).json(service);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.siteService.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Site service not found.", 404);

  const updated = await prisma.siteService.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.siteService.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Site service not found.", 404);

  await prisma.siteService.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
