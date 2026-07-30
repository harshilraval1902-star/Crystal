import "./config/env";
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
import subscriberRoutes from "./routes/subscriber.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import uploadRoutes from "./routes/upload.routes";
import usersRoutes from "./routes/users.routes";
import heroSlideRoutes from "./routes/heroSlide.routes";
import roFeatureRoutes from "./routes/roFeature.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { UPLOAD_DIR } from "./middleware/upload";
import prisma from "./config/db";
import { env } from "./config/env";

import { auditRequestMiddleware } from "./utils/audit";
import { metrics } from "./utils/metrics";
import { runBackup } from "./scripts/backup";
import v1Router from "./routes/v1";
import fs, { promises as fsPromises } from "fs";

const app = express();
const PORT = env.PORT;

// ── Trust Proxy ──────────────────────────────────────────
// Trust first proxy (essential for correct IP detection behind Nginx, Heroku, Cloudflare, etc.)
app.set("trust proxy", 1);

// ── Observability Metrics Middleware ──────────────────────
app.use((req, res, next) => {
  metrics.incrementActiveRequests();
  res.on("finish", () => {
    metrics.decrementActiveRequests();
  });
  next();
});

// ── Audit Request middleware ──────────────────────────────
app.use(auditRequestMiddleware);

// ── Security ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow image serving
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'", "*"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    xssFilter: true,
    noSniff: true,
  })
);

// Permissions Policy (Camera, Geolocation, Mic restriction rules)
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

// Disable X-Powered-By header explicitly (prevents fingerprinting)
app.disable("x-powered-by");

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
      
      // Allow if origin is explicitly in ALLOWED_ORIGINS
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In development environments, allow all if ALLOWED_ORIGINS is empty
      if (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0) {
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
  max: 200, // Temporarily increased from 20 to allow user login after crash loops
  message: { error: "Too many login attempts. Please try again later." },
});
app.use("/api/admin/auth/login", authLimiter);

// ── General Middleware ────────────────────────────────────
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static — Serve uploaded images ───────────────────────
app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));

// ── Swagger Specification Expose ──────────────────────────
app.get(["/swagger.json", "/api-docs/swagger.json"], (_req, res) => {
  try {
    const swaggerPath = path.resolve(__dirname, "../swagger.json");
    const swaggerData = fs.readFileSync(swaggerPath, "utf8");
    res.json(JSON.parse(swaggerData));
  } catch (err) {
    res.status(500).json({ error: "Failed to load swagger documentation spec." });
  }
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/reviews", reviewRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/users", usersRoutes);
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
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/ro-features", roFeatureRoutes);

// ── API Routes (Versioned v1 Router Mount) ────────────────
app.use("/api/v1", v1Router);

// ── Enterprise Metrics Ingestion ─────────────────────────
app.get("/api/metrics", (_req, res) => {
  if (process.env.ENABLE_METRICS !== "true") {
    res.status(403).json({ error: "Metrics ingestion disabled." });
    return;
  }
  res.json(metrics.getMetrics());
});

// ── Health Check ──────────────────────────────────────────
app.get(["/health", "/api/health"], async (req, res) => {
  const startDb = Date.now();
  let dbStatus = "UP";
  let dbLatency = 0;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startDb;
  } catch (err) {
    dbStatus = "DOWN";
  }

  let uploadDirStatus = "UP";
  try {
    await fsPromises.access(UPLOAD_DIR, fsPromises.constants.R_OK | fsPromises.constants.W_OK);
  } catch (err) {
    uploadDirStatus = "DOWN";
  }

  const isHealthy = dbStatus === "UP" && uploadDirStatus === "UP";
  const sysMetrics = metrics.getMetrics(dbLatency);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? "development",
    version: process.env.npm_package_version ?? "1.0.0",
    nodeVersion: process.version,
    uptime: sysMetrics.uptime,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
      },
      uploadDirectory: {
        status: uploadDirStatus,
        path: UPLOAD_DIR,
      }
    },
    metrics: {
      memory: {
        rss: Math.round(sysMetrics.memoryUsage.rss / 1024 / 1024) + "MB",
        heapTotal: Math.round(sysMetrics.memoryUsage.heapTotal / 1024 / 1024) + "MB",
        heapUsed: Math.round(sysMetrics.memoryUsage.heapUsed / 1024 / 1024) + "MB",
      },
      cpu: sysMetrics.cpuUsage,
      eventLoopDelayMs: sysMetrics.eventLoopDelayMs,
      activeRequests: sysMetrics.activeRequests,
      totalRequests: sysMetrics.totalRequests,
      errorCount: sysMetrics.errorCount,
    }
  });
});

// ── 404 & Error Handlers ──────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

let server: any;

// ── Start ─────────────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected.");

    // Trigger database backup asynchronously on startup
    runBackup().catch((err) => console.error("❌ Database backup trigger failed on startup:", err));

    server = app.listen(PORT, () => {
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

// Graceful shutdown sequence
const gracefulShutdown = (signal: string) => {
  console.log(`⚠️ Received ${signal}. Starting graceful shutdown...`);

  if (!server) {
    process.exit(0);
  }

  server.close(async () => {
    console.log("🛑 HTTP server closed.");
    try {
      await prisma.$disconnect();
      console.log("💾 Prisma client disconnected.");
      process.exit(0);
    } catch (err) {
      console.error("❌ Error during Prisma disconnect:", err);
      process.exit(1);
    }
  });

  const checkInterval = setInterval(() => {
    const active = metrics.getMetrics().activeRequests;
    if (active === 0) {
      console.log("✨ All active requests completed.");
      clearInterval(checkInterval);
    } else {
      console.log(`⏳ Waiting for ${active} active request(s) to complete...`);
    }
  }, 500);

  setTimeout(() => {
    console.error("⚠️ Force exit: active connections did not close in time.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
