import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Search as SearchIcon, X, ShoppingBag, FileText, Star, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { Input } from "./ui/Input";

interface AdminSearchContextValue {
  search: string;
  setSearch: (value: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | undefined>(undefined);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => DashboardService.getAll(),
    enabled: isSearchOpen,
    staleTime: 60000,
  });

  const searchResults = React.useMemo(() => {
    if (!data || !search.trim()) return [];
    const q = search.toLowerCase();
    const results: any[] = [];
    
    data.products?.filter((p: any) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .forEach((p: any) => results.push({ id: `p${p.id}`, title: p.name, type: 'Product', icon: ShoppingBag, url: `/admin/products` }));
    
    data.serviceRequests?.filter((r: any) => r.customerName?.toLowerCase().includes(q) || r.phone?.includes(q))
      .forEach((r: any) => results.push({ id: `s${r.id}`, title: r.customerName, type: 'Service Request', icon: FileText, url: `/admin/services` }));
    
    data.inquiries?.filter((i: any) => i.name?.toLowerCase().includes(q) || i.subject?.toLowerCase().includes(q))
      .forEach((i: any) => results.push({ id: `i${i.id}`, title: i.subject || i.name, type: 'Inquiry', icon: MessageSquare, url: `/admin/inquiries` }));

    data.reviews?.filter((r: any) => r.customerName?.toLowerCase().includes(q) || r.comment?.toLowerCase().includes(q))
      .forEach((r: any) => results.push({ id: `r${r.id}`, title: r.customerName, type: 'Review', icon: Star, url: `/admin/reviews` }));

    return results.slice(0, 10);
  }, [data, search]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearch("");
    }
  }, [isSearchOpen]);

  return (
    <AdminSearchContext.Provider value={{ search, setSearch, isSearchOpen, setIsSearchOpen }}>
      {children}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center border-b border-gray-100 px-4 py-3">
              <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-0 focus:ring-0 text-lg text-gray-900 placeholder:text-gray-400 outline-none"
                placeholder="Search products, requests, reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-gray-400 hover:text-gray-600 p-1" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {search.trim() ? (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {searchResults.length > 0 ? (
                  searchResults.map(res => (
                    <button 
                      key={res.id}
                      onClick={() => {
                        setLocation(res.url);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                        <res.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{res.title}</p>
                        <p className="text-xs text-gray-500">{res.type}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 text-sm">No results found for "{search}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 py-8 text-center border-t border-gray-50">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Actions</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => { setLocation("/admin/products/new"); setIsSearchOpen(false); }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors">Add Product</button>
                  <button onClick={() => { setLocation("/admin/amc"); setIsSearchOpen(false); }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors">Manage AMC</button>
                  <button onClick={() => { setLocation("/admin/inquiries"); setIsSearchOpen(false); }} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors">View Inquiries</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error("useAdminSearch must be used within AdminSearchProvider");
  }
  return context;
}
