import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

export default function Settings() {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Record<string, string>>({
    queryKey: ["admin-settings"],
    queryFn: () => SettingsService.getAll(),
  });

  useEffect(() => {
    if (!data) return;
    const normalized: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      normalized[key] = value ?? "";
    });
    setFields(normalized);
  }, [data]);

  const saveSettings = useMutation({
    mutationFn: () => SettingsService.update("settings", fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-settings"] }),
  });

  const handleAddField = () => {
    if (!newKey.trim()) return;
    setFields((current) => ({ ...current, [newKey.trim()]: newValue }));
    setNewKey("");
    setNewValue("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Settings"
        subtitle="Manage website configuration keys and publish updates instantly."
      />

      <SectionCard title="Website settings" description="Update config keys, add new settings, and save changes.">
        {isLoading ? (
          <div className="mt-6 text-slate-500">Loading settings…</div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load website settings.</div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4">
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-900">{key}</span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600">current</span>
                  </div>
                  <textarea
                    value={value}
                    onChange={(event) => setFields((prev) => ({ ...prev, [key]: event.target.value }))}
                    rows={3}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">New setting key</label>
                    <input
                      value={newKey}
                      onChange={(event) => setNewKey(event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-900">Value</label>
                    <input
                      value={newValue}
                      onChange={(event) => setNewValue(event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  Add setting
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => saveSettings.mutate()}
              disabled={saveSettings.isPending}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {saveSettings.isPending ? "Saving…" : "Save settings"}
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
