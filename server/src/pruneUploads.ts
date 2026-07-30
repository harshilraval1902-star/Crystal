import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import prisma from "./config/db";
import { UPLOAD_DIR } from "./middleware/upload";

async function pruneUploads() {
  console.log("🧹 Starting uploads directory prune...");

  try {
    // 1. Fetch all active image URLs/fields from the database
    const [products, slides, gallery] = await Promise.all([
      prisma.product.findMany({
        where: { isDeleted: false },
        select: { mainImageUrl: true, thumbnail: true, image: true, images: true },
      }),
      prisma.heroSlide.findMany({
        where: { isDeleted: false },
        select: { imgUrl: true },
      }),
      prisma.galleryImage.findMany({
        where: { isDeleted: false },
        select: { imageUrl: true },
      }),
    ]);

    const activeFiles = new Set<string>();

    // Helper to add filename to the active set
    const addFile = (urlOrPath: string | null | undefined) => {
      if (!urlOrPath) return;
      if (urlOrPath.includes("/uploads/")) {
        activeFiles.add(path.basename(urlOrPath));
      } else if (!urlOrPath.includes("://")) {
        activeFiles.add(path.basename(urlOrPath));
      }
    };

    // Process Products
    for (const p of products) {
      addFile(p.mainImageUrl);
      addFile(p.thumbnail);
      addFile(p.image);
      if (p.images) {
        try {
          const parsed = JSON.parse(p.images);
          if (Array.isArray(parsed)) {
            parsed.forEach((img) => addFile(img));
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Process Slides
    for (const s of slides) {
      addFile(s.imgUrl);
    }

    // Process Gallery
    for (const g of gallery) {
      addFile(g.imageUrl);
    }

    console.log(`📊 Found ${activeFiles.size} referenced files in database.`);

    // 2. Read uploads directory
    try {
      const files = await fs.readdir(UPLOAD_DIR);
      let pruneCount = 0;

      for (const file of files) {
        // Skip hidden files/directories
        if (file.startsWith(".")) continue;

        if (!activeFiles.has(file)) {
          const filePath = path.join(UPLOAD_DIR, file);
          console.log(`🗑️ Removing orphan upload: ${file}`);
          await fs.unlink(filePath);
          pruneCount++;
        }
      }

      console.log(`✅ Pruning completed. Removed ${pruneCount} orphan files.`);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.log("ℹ️ Uploads directory does not exist yet. Nothing to prune.");
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("❌ Failed to prune uploads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

pruneUploads();
