import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AdminSearchProvider } from "@/components/admin/AdminSearchContext";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AdminSearchProvider>
      <div className="min-h-screen bg-background text-gray-900 flex">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
                <Sidebar collapsed={false} onToggleCollapse={() => setMobileSidebarOpen(false)} />
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div 
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
          style={{ paddingLeft: 'var(--sidebar-width, 0)' }}
        >
          {/* We use Tailwind arbitrary values to push content based on sidebar state on desktop */}
          <div className={`hidden lg:block transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[260px]"} shrink-0 absolute left-0 h-full -z-10`} />
          <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"}`}>
            <TopBar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminSearchProvider>
  );
}
