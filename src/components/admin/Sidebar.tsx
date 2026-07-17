import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Star,
  Image,
  Wrench,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  Layers,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Droplets,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navGroups = [
  {
    title: "Dashboard",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", icon: ShoppingBag, label: "Products" },
      { href: "/admin/reviews", icon: Star, label: "Reviews" },
      { href: "/admin/gallery", icon: Image, label: "Gallery" },
    ],
  },
  {
    title: "Services",
    items: [
      { href: "/admin/amc", icon: Wrench, label: "AMC Plans" },
      { href: "/admin/site-services", icon: Layers, label: "Site Services" },
      { href: "/admin/services", icon: FileText, label: "Service Requests" },
    ],
  },
  {
    title: "Customers",
    items: [
      { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: { open: boolean; onClose: () => void; collapsed: boolean; onToggleCollapse: () => void; }) {
  const [location] = useLocation();
  const { admin, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 ${open ? "translate-x-0 shadow-xl" : "-translate-x-full"} lg:translate-x-0 ${collapsed ? "w-20" : "w-[260px]"}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-sm">
              <Droplets className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-950">Crystal Water</p>
                <p className="text-xs text-slate-500">Enterprise admin</p>
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              {!collapsed && <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{group.title}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`group flex items-center gap-3 rounded-3xl px-3 py-3 transition duration-200 ${
                          active
                            ? "bg-blue-50 text-slate-950 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        } ${collapsed ? "justify-center px-0" : ""}`}
                        onClick={onClose}
                      >
                        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        {!collapsed && (
                          <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
                        )}
                        {!collapsed && active && <span className="h-10 w-1 rounded-full bg-blue-600" />}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3 rounded-[1.75rem] bg-slate-50 p-3 transition hover:bg-slate-100">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm">{admin?.name?.[0] ?? "A"}</div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{admin?.name ?? "Admin"}</p>
                <p className="truncate text-xs text-slate-500">{admin?.email ?? "admin@crystalwater.in"}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>{collapsed ? "Expand" : "Collapse"}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
