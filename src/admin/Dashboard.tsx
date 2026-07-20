import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Activity, ShoppingBag, Layers, MessageCircle, Plus, Droplets, Download, FileText, FileSpreadsheet, FileIcon, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { DashboardService } from "@/services/dashboard.service";
import { useToast } from "@/components/admin/ToastProvider";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { AnalyticsChart } from "@/components/admin/dashboard/AnalyticsChart";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { SkeletonText, Skeleton } from "@/components/admin/ui/Skeleton";
import { exportToCSV, exportToExcel, exportToODS } from "@/utils/exportUtils";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { notify } = useToast();
  const [exporting, setExporting] = useState(false);

  // Use the SAME queryKey + queryFn as TopBar/AdminSearchContext so the cache is shared correctly.
  // All transformations happen in useMemo below, not inside the queryFn.
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => DashboardService.getAll(),
    staleTime: 5000,
  });

  const formatStr = (value: string) => {
    try { return format(parseISO(value), "MMM d, yyyy h:mm a"); }
    catch { return value ?? ""; }
  };

  // Derived data computed from raw API response
  const derived = useMemo(() => {
    if (!rawData) return null;

    const { products = [], amcPlans = [], serviceRequests = [], inquiries = [], testimonials = [] } = rawData as any;

    // Monthly chart data
    const monthMap: Record<string, { requests: number; inquiries: number }> = {};
    const addCount = (dateStr: string, type: "requests" | "inquiries") => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString("default", { month: "short" });
      if (!monthMap[key]) monthMap[key] = { requests: 0, inquiries: 0 };
      monthMap[key][type]++;
    };
    serviceRequests.forEach((r: any) => addCount(r.createdAt, "requests"));
    inquiries.forEach((i: any) => addCount(i.createdAt, "inquiries"));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyRequests = months.filter((m) => monthMap[m]).map((m) => ({ name: m, ...monthMap[m] }));

    // Activity feed
    const allActivities: any[] = [];
    products.forEach((p: any) => allActivities.push({ id: `p-${p.id}`, type: "Product Added", title: p.name, subtitle: `Category: ${p.category ?? "—"}`, date: p.createdAt, icon: ShoppingBag }));
    serviceRequests.forEach((s: any) => allActivities.push({ id: `s-${s.id}`, type: "Service Request", title: s.customerName, subtitle: `Status: ${s.status}`, date: s.createdAt, icon: Activity }));
    inquiries.forEach((i: any) => allActivities.push({ id: `i-${i.id}`, type: "Inquiry Received", title: i.name, subtitle: i.subject || "No subject", date: i.createdAt, icon: MessageCircle }));
    allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      stats: {
        totalProducts: products.length,
        totalServiceRequests: serviceRequests.length,
        totalAmcPlans: amcPlans.length,
        totalInquiries: inquiries.length,
        totalTestimonials: testimonials.length,
      },
      monthlyRequests: monthlyRequests.length > 0 ? monthlyRequests : [{ name: "No Data", requests: 0, inquiries: 0 }],
      recentServiceRequests: [...serviceRequests].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
      recentInquiries: [...inquiries].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
      activityFeed: allActivities.slice(0, 10),
      exportData: { products, serviceRequests, inquiries, amcPlans },
    };
  }, [rawData]);

  /** Format raw DB id → BK-000001 */
  const fmtBookingId = (id: number) => `BK-${String(id).padStart(6, "0")}`;

  /** Map stored status values to human-readable labels */
  const fmtStatus = (status: string): string => {
    const map: Record<string, string> = {
      new: "Pending", contacted: "Contacted", in_progress: "In Progress",
      assigned: "In Progress", completed: "Completed", cancelled: "Cancelled",
    };
    return map[status] ?? status;
  };

  const handleExport = (fmt: "CSV" | "Excel" | "ODS") => {
    if (!derived) return;
    setExporting(true);
    try {
      const exportSet = derived.exportData.serviceRequests.map((r: any) => {
        const d = new Date(r.createdAt);
        const bookingDate = isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        const bookingTime = isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
        return {
          "Booking ID":         fmtBookingId(r.id),
          "Full Name":          r.customerName ?? "",
          "Phone Number":       r.phone ?? "",
          "Address":            r.address ?? "",
          "Service Type":       r.serviceType ?? "",
          "Additional Details": r.message ?? "",
          "Booking Date":       bookingDate,
          "Booking Time":       bookingTime,
          "Booking Status":     fmtStatus(r.status),
        };
      });

      const filename = `Service_Bookings_Export_${new Date().toISOString().slice(0, 10)}`;
      if (fmt === "CSV")   exportToCSV(exportSet, filename);
      if (fmt === "Excel") exportToExcel(exportSet, filename);
      if (fmt === "ODS")   exportToODS(exportSet, filename);
      notify({ title: "Export Successful", description: `Downloaded as ${fmt}.`, variant: "success" });
    } catch (e: any) {
      const msg = e?.message || "Could not generate file.";
      if (msg.includes("No data")) {
        notify({ title: "Nothing to Export", description: "There are no service requests to download yet.", variant: "error" });
      } else {
        notify({ title: "Export Failed", description: msg, variant: "error" });
      }
    } finally {
      setExporting(false);
    }
  };

  const stats = derived?.stats;

  if (error) {
    return (
      <div className="rounded-xl border border-danger-200 bg-danger-50 p-8 text-danger-700 shadow-sm">
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group inline-block">
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </Button>
            <div className="absolute right-0 mt-2 w-52 rounded-lg shadow-xl bg-white ring-1 ring-black/5 hidden group-hover:block z-50">
              <div className="py-1.5">
                <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Service Requests</p>
                <button onClick={() => handleExport("CSV")} disabled={exporting} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2">
                  <FileText className="h-4 w-4 text-gray-500 shrink-0" /> CSV (.csv)
                </button>
                <button onClick={() => handleExport("Excel")} disabled={exporting} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-500 shrink-0" /> Excel (.xlsx)
                </button>
                <button onClick={() => handleExport("ODS")} disabled={exporting} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2">
                  <FileIcon className="h-4 w-4 text-orange-400 shrink-0" /> ODS (.ods)
                </button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => setLocation("/admin/products/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
        ) : (
          <>
            <KpiCard title="Revenue (Placeholder)" value={"₹0.00"} icon={<DollarSign className="h-6 w-6" />} trend={{ value: 0, isPositive: true, label: "Coming Soon" }} />
            <KpiCard title="Service Requests" value={stats?.totalServiceRequests ?? 0} icon={<Activity className="h-6 w-6" />} trend={{ value: 12.5, isPositive: true, label: "vs last month" }} />
            <KpiCard title="Total Inquiries" value={stats?.totalInquiries ?? 0} icon={<MessageCircle className="h-6 w-6" />} trend={{ value: 4.2, isPositive: true, label: "vs last month" }} />
            <KpiCard title="Active AMC Plans" value={stats?.totalAmcPlans ?? 0} icon={<Layers className="h-6 w-6" />} trend={{ value: 2.1, isPositive: false, label: "vs last month" }} />
            <KpiCard title="Products Listed" value={stats?.totalProducts ?? 0} icon={<ShoppingBag className="h-6 w-6" />} />
          </>
        )}
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
            <Skeleton className="h-[400px] rounded-xl" />
          ) : (
            <AnalyticsChart title="Service Requests & Inquiries Volume" data={derived?.monthlyRequests || []} dataKey="requests" color="#2563EB" height={350} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Service Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4 mt-4"><SkeletonText lines={5} /></div>
                ) : derived?.recentServiceRequests?.length ? (
                  <div className="mt-4 space-y-4">
                    {derived.recentServiceRequests.map((req: any) => (
                      <div key={req.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{req.customerName}</p>
                          <p className="text-xs text-gray-500">{req.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={req.status === "PENDING" ? "pending" : req.status === "COMPLETED" ? "active" : "default"}>{req.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">No recent service requests.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Latest Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4 mt-4"><SkeletonText lines={5} /></div>
                ) : derived?.recentInquiries?.length ? (
                  <div className="mt-4 space-y-4">
                    {derived.recentInquiries.map((inq: any) => (
                      <div key={inq.id} className="flex gap-3 items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{inq.name}</p>
                          <p className="text-xs text-gray-500 truncate">{inq.subject || "No subject"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">No new inquiries.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-brand-primary to-primary-900 text-white border-0 shadow-lg overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-5">
              <Droplets className="h-32 w-32 -mr-6 -mt-6" />
            </div>
            <CardHeader>
              <CardTitle className="text-white opacity-90">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-primary-100">Database</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2 w-2 rounded-full bg-brand-secondary animate-pulse"></span> Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary-100">API Uptime</span>
                  <span className="flex items-center gap-1.5 font-medium"><span className="h-2 w-2 rounded-full bg-brand-secondary"></span> 99.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4 mt-4"><SkeletonText lines={6} /></div>
              ) : derived?.activityFeed?.length ? (
                <div className="mt-4 relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-gray-200">
                  <div className="space-y-6">
                    {derived.activityFeed.map((activity: any, index: number) => (
                      <div key={`${activity.id}-${index}`} className="relative flex gap-4">
                        <div className="absolute left-4 -ml-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                        <div className="ml-10 flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.title} &bull; <span className="text-gray-400">{formatStr(activity.date)}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">No activity.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
