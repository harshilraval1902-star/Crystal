import pool from "./config/db";

async function clean() {
  console.log("Cleaning up content tables so frontend migration can re-seed with correct image assets...");
  try {
    await pool.execute("DELETE FROM product");
    await pool.execute("DELETE FROM amcplan");

    await pool.execute("DELETE FROM galleryimage");
    await pool.execute("DELETE FROM siteservice");
    await pool.execute("DELETE FROM faq");
    await pool.execute("DELETE FROM setting");
    console.log("✅ Cleanup done! Refresh your browser to let the frontend auto-seed with correct image paths.");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  } finally {
    await pool.end();
  }
}

clean();
