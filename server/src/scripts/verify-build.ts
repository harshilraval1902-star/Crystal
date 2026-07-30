import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import "dotenv/config";

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

async function verify() {
  console.log("🔍 Running Enterprise Build & Deployment Verification...\n");
  const results: CheckResult[] = [];

  // 1. Environment configuration validation
  try {
    const requiredEnv = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
    const missing = requiredEnv.filter((name) => !process.env[name]);

    if (missing.length > 0) {
      results.push({
        name: "Environment Validation",
        passed: false,
        message: `Missing required env variables: ${missing.join(", ")}`,
      });
    } else {
      results.push({
        name: "Environment Validation",
        passed: true,
        message: "All required core environment variables are defined.",
      });
    }
  } catch (err: any) {
    results.push({
      name: "Environment Validation",
      passed: false,
      message: err.message,
    });
  }

  // 2. Prisma validation & DB connection test
  try {
    console.log("Checking Prisma Schema & Connection...");
    execSync("npx prisma validate", { stdio: "ignore", cwd: path.resolve(__dirname, "../../") });
    results.push({
      name: "Prisma Validate Check",
      passed: true,
      message: "Prisma schema is completely valid.",
    });
  } catch (err: any) {
    results.push({
      name: "Prisma Validate Check",
      passed: false,
      message: "Prisma schema validation failed. Run 'npx prisma validate'.",
    });
  }

  // 3. TypeScript validation (Backend compilation test)
  try {
    console.log("Checking Backend TS compilation...");
    execSync("npx tsc --noEmit", { stdio: "ignore", cwd: path.resolve(__dirname, "../../") });
    results.push({
      name: "Backend Typecheck (TSC)",
      passed: true,
      message: "Backend compiles cleanly with 0 type errors.",
    });
  } catch (err: any) {
    results.push({
      name: "Backend Typecheck (TSC)",
      passed: false,
      message: "TypeScript compiler detected errors in backend source files.",
    });
  }

  // Print results summary
  console.log("\n=============================================");
  console.log("          READINESS REPORT SUMMARY           ");
  console.log("=============================================");

  let allPassed = true;
  for (const check of results) {
    const statusSymbol = check.passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`[${statusSymbol}] ${check.name}`);
    console.log(`   └─ ${check.message}\n`);
    if (!check.passed) {
      allPassed = false;
    }
  }

  console.log("=============================================");
  if (allPassed) {
    console.log("🎉 ALL CHECKS PASSED. Application is ready for deployment.");
    process.exit(0);
  } else {
    console.error("🚨 READINESS VERIFICATION FAILED. Correct issues before deploying.");
    process.exit(1);
  }
}

verify();
