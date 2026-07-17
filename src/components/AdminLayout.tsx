import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Menu } from "lucide-react";
import Sidebar from "./admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminSearchProvider } from "@/components/admin/AdminSearchContext";
import { useAuth } from "@/contexts/AuthContext";

const getHeaderContent = (path: string) => {
  if (path === "/admin" || path === "/admin/dashboard") {
    return { title: "Dashboard", subtitle: "Overview and quick insights for your admin workspace." };
  }

  if (path === "/admin/products") {
    return { title: "Products", subtitle: "Manage product catalog, pricing, and inventory." };
  }

  if (path === "/admin/amc") {
    return { title: "AMC Plans", subtitle: "Control AMC packages, pricing, and priority service options." };
  }

  if (path === "/admin/services") {
    return { title: "Service Requests", subtitle: "Track incoming service bookings and update request status." };
  }

  if (path === "/admin/inquiries") {
    return { title: "Inquiries", subtitle: "Review customer leads and respond to questions quickly." };
  }

  if (path === "/admin/testimonials") {
    return { title: "Testimonials", subtitle: "Preview and manage customer feedback for the site." };
  }

  if (path === "/admin/gallery") {
    return { title: "Gallery", subtitle: "Maintain the image gallery and update visuals effortlessly." };
  }

  if (path === "/admin/reviews") {
    return { title: "Reviews", subtitle: "Moderate customer reviews and keep quality feedback current." };
  }

  if (path === "/admin/faqs") {
    return { title: "FAQs", subtitle: "Manage frequently asked questions and help center content." };
  }

  if (path === "/admin/site-services") {
    return { title: "Site Services", subtitle: "Configure the service options shown across the website." };
  }

  if (path === "/admin/settings") {
    return { title: "Settings", subtitle: "Update account and site configuration settings." };
  }

  return { title: "Admin Console", subtitle: "Quick access tools, actions, and search for every admin page." };
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [location] = useLocation();
  const { logout } = useAuth();

  const headerContent = useMemo(() => getHeaderContent(location), [location]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  };

  return (
    <AdminSearchProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-950">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
        <div className={`min-h-screen transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-[260px]"}`}>
          <div className="border-b border-slate-200 bg-[#F8FAFC] px-4 py-4 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <AdminHeader
            title={headerContent.title}
            subtitle={headerContent.subtitle}
            onToggleTheme={handleToggleTheme}
          />
          <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AdminSearchProvider>
  );
}
