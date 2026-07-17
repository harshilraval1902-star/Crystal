import { useMemo } from "react";
import { Bell, Moon, Plus, CalendarDays, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { useAdminSearch } from "@/components/admin/AdminSearchContext";
import SearchBar from "@/components/admin/SearchBar";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onQuickAdd?: () => void;
  onToggleTheme?: () => void;
}

export default function AdminHeader({ title, subtitle, breadcrumbs = [], onQuickAdd, onToggleTheme }: AdminHeaderProps) {
  const { search, setSearch } = useAdminSearch();
  const currentDate = useMemo(() => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }), []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-20 border-b border-slate-200 bg-[#F8FAFC]/95 backdrop-blur-xl px-6 py-4 shadow-sm"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {breadcrumbs.map((item, index) => (
              <span key={item.label} className="inline-flex items-center gap-2">
                {item.href ? <a href={item.href} className="transition hover:text-slate-900">{item.label}</a> : <span>{item.label}</span>}
                {index < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
              </span>
            ))}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              {currentDate}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
              {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>}
            </div>
            {onQuickAdd ? (
              <button
                type="button"
                onClick={onQuickAdd}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Quick add
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products, plans, requests..." className="max-w-2xl" />
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-slate-900">
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-slate-900"
            >
              {typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">AW</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
