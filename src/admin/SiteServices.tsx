import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteServiceService, type SiteServiceItem } from "@/services/content.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

const ACCENT_OPTIONS = ["blue", "indigo", "cyan", "emerald", "amber", "rose"];
const ICON_OPTIONS = ["ShoppingBag", "Wrench", "Calendar", "Phone", "Star", "Shield", "Droplets", "Award", "CheckCircle"];

export default function SiteServices() {
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [cta, setCta] = useState("");
  const [icon, setIcon] = useState("ShoppingBag");
  const [accent, setAccent] = useState("blue");
  const [isActive, setIsActive] = useState(true);

  const { data: services = [], isLoading } = useQuery<SiteServiceItem[]>({
    queryKey: ["admin-site-services"],
    queryFn: () => SiteServiceService.getAll(),
  });

  const resetForm = () => { setEditId(null); setTitle(""); setDescription(""); setHref(""); setCta(""); setIcon("ShoppingBag"); setAccent("blue"); setIsActive(true); };

  const saveService = useMutation({
    mutationFn: () =>
      editId !== null
        ? SiteServiceService.update(editId, { title, description, href, cta, icon, accent, isActive })
        : SiteServiceService.create({ title, description, href, cta, icon, accent, isActive, displayOrder: services.length }),
    onSuccess: () => { resetForm(); qc.invalidateQueries({ queryKey: ["admin-site-services"] }); },
  });

  const deleteService = useMutation({
    mutationFn: (id: number) => SiteServiceService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-site-services"] }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => SiteServiceService.update(id, { isActive: !active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-site-services"] }),
  });

  const startEdit = (s: SiteServiceItem) => {
    setEditId(s.id); setTitle(s.title); setDescription(s.description); setHref(s.href);
    setCta(s.cta); setIcon(s.icon || "ShoppingBag"); setAccent(s.accent || "blue"); setIsActive(s.isActive);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site services"
        subtitle="Manage the Our Services cards shown on the Home page and other sections."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Service cards"
          description="Manage service card content, links, and website visibility in one place."
        >
          {isLoading ? <div className="mt-6 text-slate-500">Loading…</div> : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] divide-y divide-slate-200 text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-3 font-medium text-slate-500">Title</th>
                    <th className="py-3 font-medium text-slate-500">Link</th>
                    <th className="py-3 font-medium text-slate-500">Status</th>
                    <th className="py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {services.map((s) => (
                    <tr key={s.id}>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-slate-900">{s.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{s.description}</div>
                      </td>
                      <td className="py-4 pr-4 text-slate-600 text-xs">{s.href}</td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {s.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 space-x-1.5">
                        <button onClick={() => startEdit(s)}
                          className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Edit</button>
                        <button onClick={() => toggleActive.mutate({ id: s.id, active: s.isActive })}
                          className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                          {s.isActive ? "Hide" : "Show"}
                        </button>
                        <button onClick={() => deleteService.mutate(s.id)}
                          className="rounded-2xl bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-sm text-slate-500">No service cards yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title={editId ? "Edit card" : "Add card"}
          description="Create or edit service cards and control the website display state."
        >
          <form onSubmit={(e) => { e.preventDefault(); saveService.mutate(); }} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Page Link</label>
                <input required value={href} onChange={(e) => setHref(e.target.value)} placeholder="/ro-sales"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">CTA Label</label>
                <input required value={cta} onChange={(e) => setCta(e.target.value)} placeholder="View Products"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Icon</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                  {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Accent Color</label>
                <select value={accent} onChange={(e) => setAccent(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                  {ACCENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
              Active (show on website)
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saveService.isPending}
                className="flex-1 inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                {saveService.isPending ? "Saving…" : editId ? "Update Card" : "Add Card"}
              </button>
              {editId && (
                <button type="button" onClick={resetForm}
                  className="rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
