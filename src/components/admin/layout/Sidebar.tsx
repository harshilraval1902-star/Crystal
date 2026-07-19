import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  Image,
  Wrench,
  FileText,
  MessageSquare,
  HelpCircle,
  Cog,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navGroups = [
  {
    title: "MAIN",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    title: "CATALOG",
    items: [
      { href: "/admin/products", icon: ShoppingBag, label: "Products" },
      { href: "/admin/gallery", icon: Image, label: "Gallery" },
      { href: "/admin/site-services", icon: Globe, label: "Site Services" },
    ],
  },
  {
    title: "CONTENT & ENGAGEMENT",
    items: [
      { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
      { href: "/admin/reviews", icon: Star, label: "Reviews" },
      { href: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
    ],
  },
  {
    title: "SERVICES & CUSTOMERS",
    items: [
      { href: "/admin/amc", icon: Wrench, label: "AMC Plans" },
      { href: "/admin/services", icon: FileText, label: "Service Requests" },
      { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
    ],
  },
  {
    title: "SYSTEM",
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
      className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-gray-100 bg-white"
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5 border-b border-gray-100">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-blue">
          <Droplets className="h-5 w-5" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="text-sm font-bold text-gray-900 tracking-tight">Crystal Water</span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Admin Portal</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        {navGroups.map((group, i) => (
          <div key={group.title} className={i !== 0 ? "mt-6" : ""}>
            {!collapsed && (
              <div className="px-5 mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400">
                  {group.title}
                </span>
              </div>
            )}
            <nav className="space-y-0.5 px-3">
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
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {!collapsed && (
                      <span className={`text-sm font-medium ${isActive ? "text-primary-700 font-semibold" : ""}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-l-full"
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
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
