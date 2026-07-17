import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "success" | "warning" | "surface";
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  surface: "bg-slate-100 text-slate-700",
};

export default function StatCard({ label, value, icon: Icon, trend, accent = "surface" }: StatCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accentStyles[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && <p className="mt-4 text-sm text-slate-500">{trend}</p>}
    </motion.article>
  );
}
