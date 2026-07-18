import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const requests = await prisma.serviceRequest.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  res.json(requests);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: Number(req.params.id), isDeleted: false },
  });
  if (!request) throw createError("Service request not found.", 404);
  res.json(request);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    customerName: string;
    phone: string;
    email?: string;
    address?: string;
    serviceType?: string;
    message?: string;
    status?: string;
  };

  if (!data.customerName || !data.phone) {
    throw createError("customerName and phone are required.", 400);
  }

  const request = await prisma.serviceRequest.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      serviceType: data.serviceType,
      message: data.message,
      status: data.status ?? "new",
    },
  });

  res.status(201).json(request);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.serviceRequest.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Service request not found.", 404);

  const updated = await prisma.serviceRequest.update({ where: { id }, data: req.body });
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.serviceRequest.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Service request not found.", 404);

  await prisma.serviceRequest.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
