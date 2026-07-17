import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ServiceService, type ServiceRequest } from "@/services/service.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminSearch } from "@/components/admin/AdminSearchContext";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function ServiceRequests() {
  const { search } = useAdminSearch();
  const [status, setStatus] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ServiceRequest[]>({
    queryKey: ["admin-service-requests", search, status],
    queryFn: async () => (await ServiceService.getAll()).filter((request) =>
      (!search || `${request.customerName} ${request.phone} ${request.email ?? ""}`.toLowerCase().includes(search.toLowerCase())) &&
      (status === "all" || request.status === status),
    ),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status: newStatus }: { id: number; status: ServiceRequest["status"] }) => ServiceService.update(id, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] }),
  });

  const deleteRequest = useMutation({
    mutationFn: (id: number) => ServiceService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-service-requests"] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        subtitle="Track incoming customer requests and update status in real time."
      />

      <SectionCard
        title="Service booking dashboard"
        description="Track incoming service requests and filter them by status and search."
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Live requests</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Service booking queue</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <span>{data?.length ?? 0}</span>
            <span className="text-slate-400">requests</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">Search is managed from the top toolbar.</div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </SectionCard>

      <SectionCard title="Recent requests" description="Review the latest service requests and update status in one place.">
        {isLoading ? (
          <div className="mt-6 text-slate-500">Loading service requests…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load service requests.</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 font-medium text-slate-500">Customer</th>
                  <th className="py-3 font-medium text-slate-500">Contact</th>
                  <th className="py-3 font-medium text-slate-500">Created</th>
                  <th className="py-3 font-medium text-slate-500">Status</th>
                  <th className="py-3 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data?.map((request) => (
                  <tr key={request.id}>
                    <td className="py-4 pr-6">
                      <div className="font-semibold text-slate-900">{request.customerName}</div>
                      <div className="text-xs text-slate-500">{request.email ?? "No email"}</div>
                    </td>
                    <td className="py-4 pr-6 text-slate-700">{request.phone}</td>
                    <td className="py-4 pr-6 text-slate-700">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 pr-6">
                      <select
                        value={request.status}
                        onChange={(event) => updateStatus.mutate({ id: request.id, status: event.target.value as ServiceRequest["status"] })}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
                      >
                        {statusOptions.filter((item) => item.value !== "all").map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 pr-6 space-x-2">
                      <button
                        type="button"
                        onClick={() => deleteRequest.mutate(request.id)}
                        className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">No requests found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
