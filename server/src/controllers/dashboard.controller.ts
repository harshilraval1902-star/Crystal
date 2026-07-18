import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalProducts,
    totalAmcPlans,
    totalServiceRequests,
    totalInquiries,
    totalTestimonials,
    totalReviews,
    recentServiceRequests,
    recentInquiries,
    statusBreakdown,
  ] = await Promise.all([
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.amcPlan.count({ where: { isDeleted: false } }),
    prisma.serviceRequest.count({ where: { isDeleted: false } }),
    prisma.inquiry.count({ where: { isDeleted: false } }),
    prisma.testimonial.count({ where: { isDeleted: false } }),
    prisma.review.count({ where: { isDeleted: false } }),
    prisma.serviceRequest.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, customerName: true, phone: true, status: true, createdAt: true },
    }),
    prisma.inquiry.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, subject: true, createdAt: true },
    }),
    prisma.serviceRequest.groupBy({
      by: ["status"],
      where: { isDeleted: false },
      _count: { status: true },
    }),
  ]);

  res.json({
    stats: {
      totalProducts,
      totalAmcPlans,
      totalServiceRequests,
      totalInquiries,
      totalTestimonials,
      totalReviews,
    },
    statusBreakdown: statusBreakdown.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    recentServiceRequests,
    recentInquiries,
    monthlyRequests: [],
  });
});
