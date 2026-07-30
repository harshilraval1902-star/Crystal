import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required").refine(
    (val) => val.startsWith("mysql://") || val.startsWith("file:"),
    {
      message: "DATABASE_URL must be a valid connection string starting with mysql:// or file:",
    }
  ),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters long"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters long"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  UPLOAD_DIR: z.string().default("uploads"),
  PORT: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().positive().default(3001)
  ),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid Startup Environment Configuration:");
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
  } else {
    console.error("❌ Startup configuration validation failed:", error);
  }
  process.exit(1);
}

export const env = parsedEnv;
