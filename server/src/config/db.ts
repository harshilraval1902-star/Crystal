import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

// Enterprise Hardening: Prevent updates or deletions on ActivityLog audit trails
prisma.$use(async (params, next) => {
  if (params.model === "ActivityLog") {
    if (params.action === "update" || params.action === "updateMany") {
      throw new Error("ActivityLog audit records cannot be modified.");
    }
    if (params.action === "delete" || params.action === "deleteMany") {
      if (process.env.ALLOW_LOG_PRUNING !== "true") {
        throw new Error("ActivityLog audit records cannot be deleted.");
      }
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export default prisma;
