import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import amcRoutes from "./routes/amc.routes";
import reviewRoutes from "./routes/review.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import galleryRoutes from "./routes/gallery.routes";
import faqRoutes from "./routes/faq.routes";
import siteServiceRoutes from "./routes/siteService.routes";
import settingsRoutes from "./routes/settings.routes";
import serviceRequestRoutes from "./routes/serviceRequest.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import uploadRoutes from "./routes/upload.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { UPLOAD_DIR } from "./middleware/upload";
import prisma from "./config/db";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// ── Security ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow image serving
  })
);

// ── CORS ─────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 2000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Auth endpoint stricter limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 200 : 20,
  message: { error: "Too many login attempts. Please try again later." },
});
app.use("/api/admin/auth/login", authLimiter);

// ── General Middleware ────────────────────────────────────
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static — Serve uploaded images ───────────────────────
app.use("/uploads", express.static(UPLOAD_DIR));

// ── API Routes ────────────────────────────────────────────
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/amc-plans", amcRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/site-services", siteServiceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/upload", uploadRoutes);

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── 404 & Error Handlers ──────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected.");

    app.listen(PORT, () => {
      console.log(`🚀 Crystal Water API running at http://localhost:${PORT}`);
      console.log(`📁 Uploads served from /uploads`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV ?? "development"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
