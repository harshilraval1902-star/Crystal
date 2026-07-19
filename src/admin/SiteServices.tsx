import React, { useState } from "react";
import { Plus, Edit2, Trash2, Globe, LayoutTemplate } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteServiceService, type SiteServiceItem } from "@/services/content.service";
import { Button } from "@/components/admin/ui/Button";
import { BlockCard } from "@/components/admin/ui/Card";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { Badge } from "@/components/admin/ui/Badge";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";

const ACCENT_OPTIONS = ["blue", "indigo", "cyan", "emerald", "amber", "rose"];
const ICON_OPTIONS = ["ShoppingBag", "Wrench", "Calendar", "Phone", "Star", "Shield", "Droplets", "Award", "CheckCircle"];

export default function SiteServices() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteServiceItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [href, setHref] = useState("");
  const [cta, setCta] = useState("");
  const [icon, setIcon] = useState("ShoppingBag");
  const [accent, setAccent] = useState("blue");
  const [isActive, setIsActive] = useState(true);

  const [search, setSearch] = useState("");

  const { data: services = [], isLoading, error } = useQuery<SiteServiceItem[]>({
    queryKey: ["admin-site-services"],
    queryFn: () => SiteServiceService.getAll(),
  });

  const filteredItems = services.filter(item => 
    !search || item.title.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setHref("");
    setCta("");
    setIcon("ShoppingBag");
    setAccent("blue");
    setIsActive(true);
  };

  const handleEdit = (item: SiteServiceItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setHref(item.href);
    setCta(item.cta);
    setIcon(item.icon || "ShoppingBag");
    setAccent(item.accent || "blue");
    setIsActive(item.isActive);
    setIsDrawerOpen(true);
  };

  const saveService = useMutation({
    mutationFn: () => {
      const payload = { title, description, href, cta, icon, accent, isActive, displayOrder: editingItem ? editingItem.displayOrder : services.length };
      if (editingItem) {
        return SiteServiceService.update(editingItem.id, payload);
      }
      return SiteServiceService.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-site-services"] });
      notify({ title: "Success", description: `Card ${editingItem ? 'updated' : 'created'} successfully.`, variant: "success" });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: number) => SiteServiceService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-site-services"] });
      notify({ title: "Deleted", description: "The card has been removed.", variant: "success" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: (item: SiteServiceItem) => SiteServiceService.update(item.id, { isActive: !item.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-site-services"] }),
  });

  if (error) return <div className="p-8 text-danger-600">Failed to load site services.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Homepage Content</h1>
          <p className="text-sm text-gray-500">Manage the 'Our Services' cards displayed on the landing page.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsDrawerOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>

      <DataTable 
        searchPlaceholder="Search cards by title..."
        onSearch={setSearch}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Card Content</TableHead>
              <TableHead>Link Settings</TableHead>
              <TableHead className="w-[120px]">Style</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <SkeletonText lines={3} className="max-w-md mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 shrink-0">
                        <LayoutTemplate className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5" title={item.description}>{item.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-700">{item.cta}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-0.5">
                      <Globe className="h-3 w-3 mr-1" />
                      {item.href}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Icon: {item.icon}</span>
                      <span className="text-xs text-gray-500">Color: <span className="font-medium capitalize">{item.accent}</span></span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'active' : 'draft'}>
                      {item.isActive ? 'Visible' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate(item)} title={item.isActive ? 'Hide' : 'Show'}>
                        {item.isActive ? <Globe className="h-4 w-4 text-gray-400" /> : <Globe className="h-4 w-4 text-accent-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Delete this card?')) deleteService.mutate(item.id);
                      }}>
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48">
                  <EmptyState 
                    title="No content cards found" 
                    description="Add some cards to highlight your services on the homepage."
                    actionLabel="Add Card"
                    onAction={() => { resetForm(); setIsDrawerOpen(true); }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Editor Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "Edit Card" : "Add Card"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => saveService.mutate()}
              disabled={saveService.isPending}
            >
              {saveService.isPending ? "Saving..." : editingItem ? "Update Card" : "Add Card"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Card Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. RO Servicing" />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[80px]"
              placeholder="Brief description of the service..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Link URL *</label>
              <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="e.g. /services/ro" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Button Label *</label>
              <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="e.g. Learn More" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Icon</label>
              <select 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
              >
                {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Accent Color</label>
              <select 
                value={accent} 
                onChange={(e) => setAccent(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none capitalize"
              >
                {ACCENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Active (show on website)
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
