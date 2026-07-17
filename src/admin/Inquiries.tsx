import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InquiryService, type Inquiry } from "@/services/inquiry.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";
import { useAdminSearch } from "@/components/admin/AdminSearchContext";

export default function Inquiries() {
  const { search, setSearch } = useAdminSearch();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Inquiry[]>({
    queryKey: ["admin-inquiries", search],
    queryFn: async () => (await InquiryService.getAll()).filter((inquiry) =>
      !search || `${inquiry.name} ${inquiry.phone} ${inquiry.email ?? ""}`.toLowerCase().includes(search.toLowerCase()),
    ),
  });

  const deleteInquiry = useMutation({
    mutationFn: (id: number) => InquiryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        subtitle="Review incoming customer questions and delete resolved leads."
      />

      <SectionCard
        title="Inbound inquiries"
        description="Centralize incoming customer inquiries and resolve them from one workspace."
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Customer leads</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Inbound inquiries</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <span>{data?.length ?? 0}</span>
            <span className="text-slate-400">messages</span>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">Search is managed from the top toolbar.</div>
      </SectionCard>

      <SectionCard title="Inquiry list" description="Browse and remove resolved inquiries quickly.">
        <h2 className="text-xl font-semibold text-slate-950">Inquiry list</h2>
        {isLoading ? (
          <div className="mt-6 text-slate-500">Loading inquiries…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load inquiries.</div>
        ) : (
          <div className="mt-6 space-y-4">
            {data?.map((inquiry) => (
              <div key={inquiry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{inquiry.name}</p>
                    <p className="text-sm text-slate-500">{inquiry.email ?? inquiry.phone}</p>
                    <p className="text-xs text-slate-400">{new Date(inquiry.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteInquiry.mutate(inquiry.id)}
                    className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Subject</p>
                    <p className="mt-1 text-sm text-slate-600">{inquiry.subject ?? "No subject"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Message</p>
                    <p className="mt-1 text-sm text-slate-600">{inquiry.message ?? "No message"}</p>
                  </div>
                </div>
              </div>
            ))}
            {data?.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">No inquiries match your search.</div>
            ) : null}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
