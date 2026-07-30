import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/db";

export interface AuditRequest extends Request {
  id?: string;
}

// Middleware to assign a unique Request ID to each incoming request
export function auditRequestMiddleware(req: AuditRequest, _res: Response, next: NextFunction) {
  req.id = (req.headers["x-request-id"] as string) || uuidv4();
  next();
}

/**
 * Reusable utility to log admin activity trails with rich client context
 */
export async function logActivity(
  req: Request,
  adminId: number | null,
  action: string,
  entity: string,
  entityId?: number,
  additionalDetails?: Record<string, any>
) {
  const ip = req.ip || req.socket.remoteAddress || "";
  const userAgent = req.headers["user-agent"] || "";

  // Parse browser and device from User-Agent
  let browser = "Unknown";
  let device = "Desktop";

  if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|iceweasel/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";
  else if (/msie|trident/i.test(userAgent)) browser = "IE";
  else if (/opera|opr/i.test(userAgent)) browser = "Opera";

  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    device = "Mobile";
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    device = "Tablet";
  }

  const requestId = (req as any).id || "";

  const detailsObj = {
    ...additionalDetails,
    ip,
    browser,
    device,
    userAgent,
    requestId,
    timestamp: new Date().toISOString(),
  };

  try {
    return await prisma.activityLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        details: JSON.stringify(detailsObj),
      },
    });
  } catch (error) {
    console.error("❌ Failed to write activity audit log:", error);
  }
}
