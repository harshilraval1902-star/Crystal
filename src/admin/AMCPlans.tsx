import React, { useState } from "react";
import { Plus, Check, Edit2, Trash2, Shield, Wrench, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AmcService, type AmcPlan as Plan } from "@/services/amc.service";
import { Button } from "@/components/admin/ui/Button";
import { BlockCard } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { SkeletonText, Skeleton } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function AMCPlans() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [description, setDescription] = useState("");
  const [serviceVisits, setServiceVisits] = useState(1);
  const [sparePartsCovered, setSparePartsCovered] = useState(false);
  const [prioritySupport, setPrioritySupport] = useState(false);
  const [badge, setBadge] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { data = [], isLoading, error } = useQuery<Plan[]>({
    queryKey: ["admin-amc-plans"],
    queryFn: () => AmcService.getAll(),
  });

  const resetForm = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setDurationMonths(12);
    setDescription("");
    setServiceVisits(1);
    setSparePartsCovered(false);
    setPrioritySupport(false);
    setBadge("");
    setIsActive(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setDurationMonths(plan.durationMonths);
    setDescription(plan.description || "");
    setServiceVisits(plan.serviceVisits);
    setSparePartsCovered(plan.sparePartsCovered);
    setPrioritySupport(plan.prioritySupport);
    setBadge(plan.badge || "");
    setIsActive(plan.isActive);
    setIsDrawerOpen(true);
  };

  const savePlan = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        price,
        durationMonths,
        description: description || undefined,
        serviceVisits,
        sparePartsCovered,
        prioritySupport,
        badge: badge || undefined,
        isActive,
        displayOrder: editingPlan ? editingPlan.displayOrder : data.length,
      };

      if (editingPlan) {
        return AmcService.update(editingPlan.id, payload);
      }
      return AmcService.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-amc-plans"] });
      notify({ title: "Success", description: `Plan ${editingPlan ? 'updated' : 'created'} successfully.`, variant: "success" });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const deletePlan = useMutation({
    mutationFn: (id: number) => AmcService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-amc-plans"] });
      notify({ title: "Plan deleted", description: "The AMC plan has been removed.", variant: "success" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: (plan: Plan) => AmcService.update(plan.id, { isActive: !plan.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-amc-plans"] }),
  });

  if (error) return <div className="p-8 text-danger-600">Failed to load AMC plans.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AMC Plans</h1>
          <p className="text-sm text-gray-500">Manage Annual Maintenance Contracts and pricing tiers.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsDrawerOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      ) : data.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {data.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                plan.badge ? 'border-primary-500 shadow-blue' : 'border-gray-200 bg-white'
              } ${!plan.isActive && 'opacity-60 grayscale-[0.5]'}`}
            >
              {/* Badge Ribbon */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${plan.badge ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.durationMonths} Months Coverage</p>
                  </div>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-sm font-medium text-gray-500">/ plan</span>
                </div>

                {plan.description && (
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">{plan.description}</p>
                )}

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent-500 shrink-0" />
                    <span className="text-sm text-gray-700">{plan.serviceVisits} Scheduled Service Visits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    {plan.sparePartsCovered ? (
                      <Check className="h-5 w-5 text-accent-500 shrink-0" />
                    ) : (
                      <Wrench className="h-5 w-5 text-gray-400 shrink-0" />
                    )}
                    <span className={`text-sm ${plan.sparePartsCovered ? 'text-gray-700' : 'text-gray-400'}`}>
                      {plan.sparePartsCovered ? 'Free Spare Parts Coverage' : 'Spare Parts at Additional Cost'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    {plan.prioritySupport ? (
                      <Check className="h-5 w-5 text-accent-500 shrink-0" />
                    ) : (
                      <Star className="h-5 w-5 text-gray-400 shrink-0" />
                    )}
                    <span className={`text-sm ${plan.prioritySupport ? 'text-gray-700' : 'text-gray-400'}`}>
                      {plan.prioritySupport ? '24/7 Priority Support' : 'Standard Business Hours Support'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto border-t border-gray-100 bg-gray-50 p-4 flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => toggleActive.mutate(plan)}
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="secondary" size="icon" onClick={() => handleEdit(plan)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                  onClick={() => {
                    if (confirm("Delete this AMC plan?")) {
                      deletePlan.mutate(plan.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <BlockCard>
          <EmptyState 
            title="No AMC plans" 
            description="Create your first Annual Maintenance Contract plan to offer to customers."
            actionLabel="Create Plan"
            onAction={() => { resetForm(); setIsDrawerOpen(true); }}
          />
        </BlockCard>
      )}

      {/* Editor Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingPlan ? "Edit AMC Plan" : "Create New Plan"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => savePlan.mutate()}
              disabled={savePlan.isPending}
            >
              {savePlan.isPending ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Plan Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Protection" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹) *</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Duration (Months) *</label>
              <Input type="number" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[80px]"
              placeholder="Brief overview of what this plan includes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Service Visits</label>
              <Input type="number" value={serviceVisits} onChange={(e) => setServiceVisits(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Badge (Optional)</label>
              <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Best Value" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={sparePartsCovered} onChange={(e) => setSparePartsCovered(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Spare Parts Covered</p>
                <p className="text-gray-500">Filters and parts are replaced at no extra cost.</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={prioritySupport} onChange={(e) => setPrioritySupport(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Priority Support</p>
                <p className="text-gray-500">Customer gets moved to the front of the queue.</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Active</p>
                <p className="text-gray-500">Plan is visible and available for purchase.</p>
              </div>
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
