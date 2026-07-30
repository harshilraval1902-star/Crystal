import React from "react";
import { cn } from "./Button";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 w-${i === lines - 1 ? '2/3' : 'full'}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ hasImage = true, className }: { hasImage?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 overflow-hidden", className)}>
      {hasImage && <Skeleton className="h-48 w-full rounded-xl" />}
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-gray-200 bg-white", className)}>
      <div className="border-b border-gray-200 bg-gray-50/50 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-gray-100 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton 
                key={j} 
                className={cn("h-4 flex-1", j === 0 && "w-1/3 flex-none", j === cols - 1 && "w-1/4 flex-none")} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonDashboard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-2 flex-1 mr-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-1/2" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
      {/* Charts / Lists Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-4 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
