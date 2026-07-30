import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const retentionDaysStr = process.env.LOG_RETENTION_DAYS;
  const retentionDays = parseInt(retentionDaysStr || "90", 10);

  // Allow database pruning operation
  process.env.ALLOW_LOG_PRUNING = "true";

  if (isNaN(retentionDays) || retentionDays <= 0) {
    console.error(`❌ Invalid LOG_RETENTION_DAYS value: "${retentionDaysStr}". Must be a positive integer.`);
    process.exit(1);
  }

  console.log(`🧹 Starting ActivityLog pruning...`);
  console.log(`📅 Retention period: ${retentionDays} days.`);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  console.log(`🗓️  Deleting activity logs created before: ${cutoffDate.toISOString()}`);

  try {
    const deletedCount = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`✅ Pruned ${deletedCount.count} activity log records successfully.`);
  } catch (error) {
    console.error("❌ Error while pruning activity logs:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
