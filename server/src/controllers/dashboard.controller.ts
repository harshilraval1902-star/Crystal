import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalProductsRows,
    totalAmcPlansRows,
    totalServiceRequestsRows,
    totalInquiriesRows,
    recentServiceRequestsRows,
    recentInquiriesRows,
    statusBreakdownRows,
  ] = await Promise.all([
    pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM product WHERE isDeleted = ?", [false]),
    pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM amcplan WHERE isDeleted = ?", [false]),
    pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM servicerequest WHERE isDeleted = ?", [false]),
    pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM inquiry WHERE isDeleted = ?", [false]),
    pool.query<RowDataPacket[]>(
      "SELECT id, customerName, phone, status, createdAt FROM servicerequest WHERE isDeleted = ? ORDER BY createdAt DESC LIMIT 5",
      [false]
    ),
    pool.query<RowDataPacket[]>(
      "SELECT id, name, email, subject, createdAt FROM inquiry WHERE isDeleted = ? ORDER BY createdAt DESC LIMIT 5",
      [false]
    ),
    pool.query<RowDataPacket[]>(
      "SELECT status, COUNT(*) as count FROM servicerequest WHERE isDeleted = ? GROUP BY status",
      [false]
    ),
  ]);

  const totalProducts = totalProductsRows[0][0].count;
  const totalAmcPlans = totalAmcPlansRows[0][0].count;
  const totalServiceRequests = totalServiceRequestsRows[0][0].count;
  const totalInquiries = totalInquiriesRows[0][0].count;

  res.json({
    stats: {
      totalProducts,
      totalAmcPlans,
      totalServiceRequests,
      totalInquiries,
    },
    statusBreakdown: statusBreakdownRows[0].map((item: any) => ({
      status: item.status,
      count: item.count,
    })),
    recentServiceRequests: recentServiceRequestsRows[0],
    recentInquiries: recentInquiriesRows[0],
    monthlyRequests: [],
  });
});
