import { performance } from "perf_hooks";

export interface SystemMetrics {
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  eventLoopDelayMs: number;
  databaseLatencyMs: number;
  activeRequests: number;
  totalRequests: number;
  errorCount: number;
}

let activeRequestsCount = 0;
let totalRequestsCount = 0;
let errorCountVal = 0;

// Event loop delay tracker
let lastIntervalTime = Date.now();
let eventLoopDelay = 0;
setInterval(() => {
  const now = Date.now();
  eventLoopDelay = Math.max(0, now - lastIntervalTime - 1000);
  lastIntervalTime = now;
}, 1000).unref();

export const metrics = {
  incrementActiveRequests() {
    activeRequestsCount++;
    totalRequestsCount++;
  },
  decrementActiveRequests() {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
  },
  incrementErrorCount() {
    errorCountVal++;
  },
  getMetrics(dbLatencyMs = 0): SystemMetrics {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      eventLoopDelayMs: eventLoopDelay,
      databaseLatencyMs: dbLatencyMs,
      activeRequests: activeRequestsCount,
      totalRequests: totalRequestsCount,
      errorCount: errorCountVal,
    };
  }
};
