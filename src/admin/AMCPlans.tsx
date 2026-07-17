import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AmcService, type AmcPlan as Plan } from "@/services/amc.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AMCPlans() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [description, setDescription] = useState("");
  const [serviceVisits, setServiceVisits] = useState(1);
  const [sparePartsCovered, setSparePartsCovered] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(false);
  const [badge, setBadge] = useState("");
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Plan[]>({
    queryKey: ["admin-amc-plans"],
    queryFn: () => AmcService.getAll(),
  });

  const createPlan = useMutation<Plan, Error, void>({
    mutationFn: () => AmcService.create({
        name,
        price,
        durationMonths,
        description: description || undefined,
        serviceVisits,
        sparePartsCovered,
        prioritySupport,
        badge: badge || undefined,
        isActive,
        displayOrder: data?.length ?? 0,
      }),
    onSuccess: () => {
      setName("");
      setPrice("");
      setDurationMonths(12);
      setDescription("");
      setServiceVisits(1);
      setSparePartsCovered(false);
      setPrioritySupport(false);
      setBadge("");
      setIsActive(true);
      queryClient.invalidateQueries({ queryKey: ["admin-amc-plans"] });
    },
  });

  const togglePlan = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => AmcService.update(id, { isActive: !active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-amc-plans"] }),
  });

  const deletePlan = useMutation({
    mutationFn: (id: number) => AmcService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-amc-plans"] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AMC Plans"
        subtitle="Review and manage AMC plan offerings, pricing, and priority service settings."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="AMC plans"
          description="Manage maintenance plans, pricing tiers, and availability from one panel."
        >
          {isLoading ? (
            <div className="mt-6 text-slate-500">Loading plans…</div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load maintenance plans.</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px] divide-y divide-slate-200 text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-3 font-medium text-slate-500">Name</th>
                    <th className="py-3 font-medium text-slate-500">Price</th>
                    <th className="py-3 font-medium text-slate-500">Duration</th>
                    <th className="py-3 font-medium text-slate-500">Status</th>
                    <th className="py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data?.map((plan) => (
                    <tr key={plan.id}>
                      <td className="py-4 pr-6">
                        <div className="font-semibold text-slate-900">{plan.name}</div>
                        <div className="text-xs text-slate-500">{plan.badge ?? "Standard"}</div>
                      </td>
                      <td className="py-4 pr-6 text-slate-700">₹{plan.price}</td>
                      <td className="py-4 pr-6 text-slate-700">{plan.durationMonths} months</td>
                      <td className="py-4 pr-6 text-slate-700">{plan.isActive ? "Active" : "Inactive"}</td>
                      <td className="py-4 pr-6 space-x-2">
                        <button
                          type="button"
                          onClick={() => togglePlan.mutate({ id: plan.id, active: plan.isActive })}
                          className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          {plan.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePlan.mutate(plan.id)}
                          className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-sm text-slate-500">No AMC plans found.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Create new plan"
          description="Add or update AMC plans with service details and subscription options."
        >
          <form onSubmit={(event) => {
            event.preventDefault();
            createPlan.mutate();
          }} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Price</label>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Duration (months)</label>
              <input
                type="number"
                min={1}
                value={durationMonths}
                onChange={(event) => setDurationMonths(Number(event.target.value))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Service visits</label>
                <input
                  type="number"
                  min={0}
                  value={serviceVisits}
                  onChange={(event) => setServiceVisits(Number(event.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Badge</label>
                <input
                  value={badge}
                  onChange={(event) => setBadge(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
                <input type="checkbox" checked={sparePartsCovered} onChange={(event) => setSparePartsCovered(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                Spare parts covered
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
                <input type="checkbox" checked={prioritySupport} onChange={(event) => setPrioritySupport(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                Priority support
              </label>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
              <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
              Active
            </label>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {createPlan.isPending ? "Saving…" : "Create plan"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
