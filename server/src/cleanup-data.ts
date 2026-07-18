import prisma from "./config/db";

async function clean() {
  console.log("Cleaning up content tables so frontend migration can re-seed with correct image assets...");
  try {
    await prisma.product.deleteMany();
    await prisma.amcPlan.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.siteService.deleteMany();
    await prisma.faq.deleteMany();
    await prisma.setting.deleteMany();
    console.log("✅ Cleanup done! Refresh your browser to let the frontend auto-seed with correct image paths.");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
