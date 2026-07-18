import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/settings  — returns { key: value, ... }
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

// PUT /api/settings  — body: { key: value, ... }
export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as Record<string, string>;

  const ops = Object.entries(data).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  );

  await prisma.$transaction(ops);

  const rows = await prisma.setting.findMany();
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }

  res.json(result);
});

// POST /api/settings — alias for update
export const create = update;
