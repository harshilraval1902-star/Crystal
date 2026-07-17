import { useMemo } from "react";
import { Activity, LayoutDashboard, ShoppingBag, Layers, MessageCircle, Plus, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";
import StatCard from "@/components/admin/StatCard";

interface DashboardResponse {
  stats: {
    totalProducts: number;
    totalServiceRequests: number;
    totalAmcPlans: number;
    totalInquiries: number;
    totalTestimonials: number;
  };
  statusBreakdown: Array<{ status: string; count: number }>;
  monthlyRequests: Array<{ month: string; count: string }>;
  recentServiceRequests: Array<{ id: number; customerName: string; phone: string; status: string; createdAt: string }>;
  recentInquiries: Array<{ id: number; name: string; email: string | null; subject: string | null; createdAt: string }>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const { products, amcPlans, serviceRequests, inquiries, testimonials } = await DashboardService.getAll();
      const statusBreakdown = Object.entries(serviceRequests.reduce<Record<string, number>>((result, request) => ({ ...result, [request.status]: (result[request.status] ?? 0) + 1 }), {})).map(([status, count]) => ({ status, count }));
      return {
        stats: { totalProducts: products.length, totalServiceRequests: serviceRequests.length, totalAmcPlans: amcPlans.length, totalInquiries: inquiries.length, totalTestimonials: testimonials.length },
        statusBreakdown,
        monthlyRequests: [],
        recentServiceRequests: serviceRequests.slice(0, 5).map((request) => ({ ...request, email: request.email ?? null })),
        recentInquiries: inquiries.slice(0, 5).map((inquiry) => ({ ...inquiry, email: inquiry.email ?? null, subject: inquiry.subject ?? null })),
      };
    },
    staleTime: 0,
  });

  const stats = data?.stats;
  const statusItems = data?.statusBreakdown ?? [];
  const monthly = data?.monthlyRequests ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crystal Water Admin"
        subtitle="Live operational metrics for products, plans, inquiries, and service requests."
        breadcrumbs={[{ label: "Dashboard" }]}
        actions={
          <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New report
          </button>
        }
      />

      {isLoading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
          Error loading dashboard data.
        </div>
      ) : (
        <>
          <SectionCard
            title="Performance overview"
            description="Track your top product, service, and customer metrics at a glance."
            actions={
              <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create report
              </button>
            }
          >
            <div className="grid gap-6 xl:grid-cols-5">
              <StatCard label="Total products" value={stats?.totalProducts ?? 0} icon={ShoppingBag} accent="primary" trend="Up 12% in the last 30 days" />
              <StatCard label="Service requests" value={stats?.totalServiceRequests ?? 0} icon={Activity} accent="warning" trend="Stable this week" />
              <StatCard label="AMC plans" value={stats?.totalAmcPlans ?? 0} icon={Layers} accent="surface" trend="New package added" />
              <StatCard label="Inquiries" value={stats?.totalInquiries ?? 0} icon={MessageCircle} accent="success" trend="Higher response rate" />
              <StatCard label="Testimonials" value={stats?.totalTestimonials ?? 0} icon={Star} accent="primary" trend="Featured reviews rising" />
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <SectionCard title="Request status" description="Monitor ticket status and volume in a unified view.">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Request status</p>
                <span className="text-xs text-slate-400">Overview</span>
              </div>
              <div className="mt-6 space-y-3">
                {statusItems.length ? statusItems.map((item) => (
                  <div key={item.status} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-700">{item.status.replace(/_/g, " ")}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                  </div>
                )) : <p className="text-sm text-slate-500">No request status data available yet.</p>}
              </div>
            </SectionCard>

            <SectionCard title="Latest inquiries" description="Recent customer messages requiring attention.">
              <div className="mt-6 space-y-3">
                {data?.recentInquiries.length ? data.recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-950">{inquiry.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{inquiry.subject ?? "No subject"}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatDate(inquiry.createdAt)}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">No inquiries yet.</p>}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Monthly request volume" description="Projected request growth and trend insights.">
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {monthly.length ? monthly.map((item) => (
                <div key={item.month} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.month}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{item.count}</p>
                </div>
              )) : <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">No monthly data available.</div>}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
