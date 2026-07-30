import "dotenv/config";
import { metrics } from "./metrics";

export class ErrorTracker {
  private static isInitialized = false;
  private static trackerType: "sentry" | "bugsnag" | "console" = "console";

  public static init(): void {
    if (this.isInitialized) return;

    const dsn = process.env.SENTRY_DSN;
    const bugsnagKey = process.env.BUGSNAG_API_KEY;

    if (dsn) {
      this.trackerType = "sentry";
      console.log("🚀 ErrorTracker: Initialized Sentry error tracking interface.");
      // In production, you would require and configure @sentry/node here dynamically
    } else if (bugsnagKey) {
      this.trackerType = "bugsnag";
      console.log("🚀 ErrorTracker: Initialized Bugsnag error tracking interface.");
      // In production, require and configure @bugsnag/js here
    } else {
      this.trackerType = "console";
      console.log("🚀 ErrorTracker: Configured console output fallbacks for error tracking.");
    }

    this.isInitialized = true;
  }

  public static captureException(error: Error, context?: Record<string, any>): void {
    // Increment metrics error counter
    metrics.incrementErrorCount();

    if (this.trackerType === "sentry") {
      // Mock sentry logging or delegate to library if imported
      console.error("[SENTRY ERROR REPORT]", error, "Context:", context);
    } else if (this.trackerType === "bugsnag") {
      console.error("[BUGSNAG ERROR REPORT]", error, "Context:", context);
    } else {
      console.error("[CONSOLE ERROR REPORT]", error, "Context:", context);
    }
  }

  public static captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}

// Auto-initialize on load
ErrorTracker.init();
export default ErrorTracker;
