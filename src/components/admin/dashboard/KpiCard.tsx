import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "../ui/Button";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
}

export function KpiCard({ title, value, icon, trend, className }: KpiCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.isPositive ? "bg-accent-50 text-accent-600" : "bg-danger-50 text-danger-600"
            )}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}%
          </div>
          <span className="text-xs text-gray-500">{trend.label}</span>
        </div>
      )}
    </Card>
  );
}
