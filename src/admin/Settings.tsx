import React, { useEffect, useState } from "react";
import { Plus, Save, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/settings.service";
import { Button } from "@/components/admin/ui/Button";
import { BlockCard } from "@/components/admin/ui/Card";
import { Input } from "@/components/admin/ui/Input";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ToastProvider";

export default function Settings() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [fields, setFields] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      notify({ title: "Settings Saved", description: "Website configuration has been updated.", variant: "success" });
    },
  });

  const handleAddField = () => {
    if (!newKey.trim()) {
      notify({ title: "Error", description: "Setting key cannot be empty.", variant: "error" });
      return;
    }
    if (fields[newKey.trim()] !== undefined) {
      notify({ title: "Error", description: "Setting key already exists.", variant: "error" });
      return;
    }
    setFields((current) => ({ ...current, [newKey.trim()]: newValue }));
    setNewKey("");
    setNewValue("");
  };

  const removeField = (key: string) => {
    const updated = { ...fields };
    delete updated[key];
    setFields(updated);
  };

  if (error) return <div className="p-8 text-danger-600">Failed to load settings.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500">Manage global website configuration and environment variables.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => saveSettings.mutate()}
          disabled={saveSettings.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {saveSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="grid gap-6">
        <BlockCard 
          title="Configuration Variables" 
          description="Update text values, links, and contact info used across the website."
          className="overflow-hidden"
        >
          {isLoading ? (
            <div className="space-y-6">
              <SkeletonText lines={2} />
              <SkeletonText lines={2} />
              <SkeletonText lines={2} />
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(fields).length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No configuration settings found. Add one below.
                </div>
              ) : (
                <div className="grid gap-6">
                  {Object.entries(fields).map(([key, value]) => (
                    <div key={key} className="flex gap-4 items-start group">
                      <div className="w-1/3 pt-2">
                        <label className="text-sm font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block truncate max-w-full" title={key}>
                          {key}
                        </label>
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          value={value}
                          onChange={(e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))}
                          rows={value.length > 50 || value.includes('\n') ? 3 : 1}
                          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[40px] resize-y font-mono"
                          placeholder="Empty value..."
                        />
                      </div>
                      <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => removeField(key)} className="text-danger-500 hover:bg-danger-50 hover:text-danger-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </BlockCard>

        <BlockCard title="Add New Variable">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Key</label>
              <Input 
                value={newKey} 
                onChange={(e) => setNewKey(e.target.value)} 
                placeholder="e.g. COMPANY_PHONE" 
                className="font-mono"
              />
            </div>
            <div className="flex-[2] space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</label>
              <Input 
                value={newValue} 
                onChange={(e) => setNewValue(e.target.value)} 
                placeholder="e.g. +91 9876543210" 
                className="font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddField();
                  }
                }}
              />
            </div>
            <div className="pt-6">
              <Button variant="secondary" onClick={handleAddField}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </BlockCard>
      </div>
    </div>
  );
}
