import path from "path";
import fs from "fs/promises";
import { UPLOAD_DIR } from "../middleware/upload";

/**
 * Safely deletes an uploaded file from disk using its URL or path.
 * If the file is not a local upload, doesn't exist, or cannot be deleted,
 * it handles the error gracefully without throwing.
 */
export async function deleteUploadedFile(urlOrPath: string | null | undefined): Promise<void> {
  if (!urlOrPath) return;

  try {
    let filename: string;
    if (urlOrPath.includes("/uploads/")) {
      filename = path.basename(urlOrPath);
    } else if (!urlOrPath.includes("://")) {
      // It might be a direct filename or relative path
      filename = path.basename(urlOrPath);
    } else {
      // External URL
      return;
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
  } catch (error: any) {
    // Ignore safely (e.g. file not found / ENOENT)
  }
}
