import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

// Helper to compute date filter where clause
function getDateFilterClause(filter?: string, startDate?: string, endDate?: string) {
  const now = new Date();
  if (filter === "today") {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { gte: todayStart };
  }
  if (filter === "7days") {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { gte: sevenDaysAgo };
  }
  if (filter === "30days") {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { gte: thirtyDaysAgo };
  }
  if (filter === "year") {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    return { gte: yearStart };
  }
  if (filter === "custom" && startDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    // Set end of day for lte
    end.setHours(23, 59, 59, 999);
    return { gte: start, lte: end };
  }
  return undefined;
}

// GET /api/subscribers (Admin only - Paginated, sorted, filtered, stats)
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const search = req.query.search as string | undefined;
  const sort = (req.query.sort as string) || "createdAt";
  const order = (req.query.order as "asc" | "desc") || "desc";
  const filter = req.query.filter as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  const skip = (page - 1) * limit;

  // Build prisma where clause
  const where: any = {};
  if (search) {
    where.email = { contains: search };
  }

  const dateFilter = getDateFilterClause(filter, startDate, endDate);
  if (dateFilter) {
    where.createdAt = dateFilter;
  }

  // Fetch paginated subscribers
  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { [sort]: order },
      skip,
      take: limit,
    }),
    prisma.subscriber.count({ where }),
  ]);

  // Compute Statistics (KPIs)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalSubscribers, newThisWeek, newThisMonth] = await Promise.all([
    prisma.subscriber.count({ where: { isActive: true } }),
    prisma.subscriber.count({ where: { isActive: true, createdAt: { gte: sevenDaysAgo } } }),
    prisma.subscriber.count({ where: { isActive: true, createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const previousTotal = totalSubscribers - newThisMonth;
  const growthPercent = previousTotal > 0 
    ? Number(((newThisMonth / previousTotal) * 100).toFixed(1))
    : (totalSubscribers > 0 ? 100 : 0);

  res.json({
    subscribers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalSubscribers,
      newThisWeek,
      newThisMonth,
      growthPercent,
    },
  });
});

// Create a subscription (Public)
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  if (!email) {
    throw createError("Email address is required.", 400);
  }

  // Simple validation check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError("Please provide a valid email address.", 400);
  }

  // Check if subscriber already exists
  const existing = await prisma.subscriber.findUnique({
    where: { email },
  });

  if (existing) {
    if (existing.isActive) {
      throw createError("This email is already subscribed.", 400);
    } else {
      // Re-activate subscription
      const updated = await prisma.subscriber.update({
        where: { id: existing.id },
        data: { isActive: true },
      });
      return res.status(200).json(updated);
    }
  }

  const subscriber = await prisma.subscriber.create({
    data: {
      email,
      isActive: true,
    },
  });

  res.status(201).json(subscriber);
});

// Remove a subscriber (Admin only)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.subscriber.findUnique({
    where: { id },
  });
  if (!existing) {
    throw createError("Subscriber not found.", 404);
  }

  await prisma.subscriber.delete({
    where: { id },
  });

  res.status(204).send();
});

// Bulk Delete Subscribers (Admin only)
export const bulkDelete = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: number[] };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError("Subscriber IDs array is required.", 400);
  }

  await prisma.subscriber.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  res.status(204).send();
});

// Export Subscribers (Admin only - returns matching non-paginated subscribers)
export const exportSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const filter = req.query.filter as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;
  const sort = (req.query.sort as string) || "createdAt";
  const order = (req.query.order as "asc" | "desc") || "desc";

  const where: any = {};
  if (search) {
    where.email = { contains: search };
  }

  const dateFilter = getDateFilterClause(filter, startDate, endDate);
  if (dateFilter) {
    where.createdAt = dateFilter;
  }

  const subscribers = await prisma.subscriber.findMany({
    where,
    orderBy: { [sort]: order },
  });

  res.json(subscribers);
});
