import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, X, ShoppingBag, Activity, MessageCircle, Star } from "lucide-react";
import { Input } from "../ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminSearch } from "@/components/admin/AdminSearchContext";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { formatDistanceToNow } from "date-fns";

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

export function TopBar({ onOpenMobileSidebar }: TopBarProps) {
  const { admin } = useAuth();
  const { search, setSearch, setIsSearchOpen } = useAdminSearch();
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch data to generate notifications (relies on react-query cache from dashboard)
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => DashboardService.getAll(),
    staleTime: 5000,
  });

  const notifications = React.useMemo(() => {
    if (!data) return [];
    const all: any[] = [];
    data.products?.forEach((p: any) => all.push({ id: `p${p.id}`, text: `New product added: ${p.name}`, time: p.createdAt, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100' }));
    data.serviceRequests?.forEach((r: any) => all.push({ id: `s${r.id}`, text: `Service request from ${r.customerName}`, time: r.createdAt, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-100' }));
    data.inquiries?.forEach((i: any) => all.push({ id: `i${i.id}`, text: `Inquiry: ${i.subject || i.name}`, time: i.createdAt, icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-100' }));
    data.reviews?.forEach((r: any) => all.push({ id: `r${r.id}`, text: `New ${r.rating}-star review from ${r.customerName}`, time: r.createdAt, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' }));
    
    return all.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
  }, [data]);

  // Handle Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsSearchOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onOpenMobileSidebar} className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md">
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Global Search Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center w-64 lg:w-80 h-9 bg-gray-50/50 hover:bg-gray-100 border border-gray-100 rounded-md px-3 text-sm text-gray-400 transition-colors"
        >
          <Search className="h-4 w-4 mr-2 text-gray-400" />
          <span>Search (Cmd+K)</span>
        </button>
      </div>

      <div className="flex items-center gap-3 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white"></span>}
        </button>

        {showNotifications && (
          <div className="absolute top-12 right-12 w-80 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.bg} ${n.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-tight mb-1">{n.text}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {n.time ? (() => { try { return formatDistanceToNow(new Date(n.time), { addSuffix: true }); } catch { return "just now"; } })() : "just now"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">No new notifications</div>
              )}
            </div>
          </div>
        )}
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        
        <button className="flex items-center gap-3 rounded-full hover:bg-gray-50 p-1 pr-3 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
            {admin?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{admin?.name || "Admin User"}</p>
            <p className="text-xs text-gray-500 leading-tight">Administrator</p>
          </div>
        </button>
      </div>
    </header>
  );
}
