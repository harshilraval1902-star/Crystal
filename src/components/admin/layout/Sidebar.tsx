import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  Image as ImageIcon,
  Wrench,
  FileText,
  MessageSquare,
  HelpCircle,
  Cog,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Globe,
  MonitorPlay,
  Layers
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    title: "Homepage",
    items: [
      { href: "/admin/hero-slides", icon: MonitorPlay, label: "Hero Slides" },
      { href: "/admin/ro-features", icon: Layers, label: "RO Features" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/products", icon: ShoppingBag, label: "Products" },
      { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
      { href: "/admin/site-services", icon: Globe, label: "Site Services" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
      { href: "/admin/reviews", icon: Star, label: "Reviews" },
      { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
    ],
  },
  {
    title: "Requests",
    items: [
      { href: "/admin/amc", icon: Wrench, label: "AMC Plans" },
      { href: "/admin/services", icon: FileText, label: "Service Requests" },
      { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", icon: Cog, label: "Settings" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { admin } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-primary-800 bg-brand-primary text-white"
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5 border-b border-primary-800">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary text-brand-primary shadow-sm">
          <Droplets className="h-4 w-4 font-bold" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="text-sm font-extrabold tracking-tight">Crystal Admin</span>
            <span className="text-[10px] font-medium text-primary-200 uppercase tracking-widest">Workspace</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        {navGroups.map((group, i) => (
          <div key={group.title} className={i !== 0 ? "mt-6" : ""}>
            {!collapsed && (
              <div className="px-5 mb-2">
                <span className="text-[11px] font-bold tracking-widest text-primary-300 uppercase">
                  {group.title}
                </span>
              </div>
            )}
            <nav className="space-y-1 px-3">
              {group.items.map((item) => {
                const isActive = location === item.href || (item.href !== "/admin/dashboard" && location.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-primary-100 hover:bg-white/5 hover:text-white"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-brand-secondary" : "text-primary-200 group-hover:text-brand-secondary"}`} />
                    {!collapsed && (
                      <span className={`text-sm font-medium ${isActive ? "font-bold" : ""}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-secondary rounded-l-full shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                      />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / Collapse */}
      <div className="border-t border-primary-800 p-4">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm text-primary-200 hover:bg-white/5 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
