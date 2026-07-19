import React, { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, MessageCircleQuestion } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaqService, type Faq } from "@/services/content.service";
import { Button } from "@/components/admin/ui/Button";
import { BlockCard } from "@/components/admin/ui/Card";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { Badge } from "@/components/admin/ui/Badge";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { EmptyState } from "@/components/admin/ui/EmptyState";

const CATEGORIES = ["AMC", "General", "Products", "Service"];

export default function Faqs() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Faq | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [isActive, setIsActive] = useState(true);

  const { data: faqs = [], isLoading, error } = useQuery<Faq[]>({
    queryKey: ["admin-faqs"],
    queryFn: () => FaqService.getAll(),
  });

  const resetForm = () => {
    setEditingItem(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setIsActive(true);
  };

  const handleEdit = (item: Faq) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category);
    setIsActive(item.isActive);
    setIsDrawerOpen(true);
  };

  const saveFaq = useMutation({
    mutationFn: () => {
      const payload = { question, answer, category, isActive, displayOrder: editingItem ? editingItem.displayOrder : faqs.length };
      if (editingItem) {
        return FaqService.update(editingItem.id, payload);
      }
      return FaqService.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      notify({ title: "Success", description: `FAQ ${editingItem ? 'updated' : 'created'} successfully.`, variant: "success" });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const deleteFaq = useMutation({
    mutationFn: (id: number) => FaqService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      notify({ title: "Deleted", description: "The FAQ has been removed.", variant: "success" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: (item: Faq) => FaqService.update(item.id, { isActive: !item.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  if (error) return <div className="p-8 text-danger-600">Failed to load FAQs.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FAQs</h1>
          <p className="text-sm text-gray-500">Manage Frequently Asked Questions across your website.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsDrawerOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <BlockCard className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-6">
            <SkeletonText lines={2} />
            <SkeletonText lines={2} />
            <SkeletonText lines={2} />
          </div>
        ) : faqs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {faqs.map((faq) => (
              <div key={faq.id} className={`group transition-colors ${!faq.isActive ? 'bg-gray-50/50' : 'hover:bg-gray-50/50'}`}>
                <div 
                  className="flex items-start justify-between gap-4 p-4 sm:p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600">
                      <MessageCircleQuestion className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="default" className="bg-gray-100 text-gray-600 border-0">{faq.category}</Badge>
                        {!faq.isActive && <Badge variant="draft">Hidden</Badge>}
                      </div>
                      <h3 className={`text-base font-semibold ${!faq.isActive ? 'text-gray-500' : 'text-gray-900'}`}>
                        {faq.question}
                      </h3>
                      
                      {expandedId === faq.id && (
                        <div className="mt-3 text-sm text-gray-600 leading-relaxed pr-8 animate-in slide-in-from-top-2 duration-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate(faq)} title={faq.isActive ? 'Hide' : 'Publish'}>
                        {faq.isActive ? <Badge variant="active" className="h-2 w-2 rounded-full p-0" /> : <Badge variant="draft" className="h-2 w-2 rounded-full p-0" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Delete this FAQ?')) deleteFaq.mutate(faq.id);
                      }}>
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      {expandedId === faq.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8">
            <EmptyState 
              title="No FAQs found" 
              description="Add frequently asked questions to help your customers."
              actionLabel="Add FAQ"
              onAction={() => { resetForm(); setIsDrawerOpen(true); }}
            />
          </div>
        )}
      </BlockCard>

      {/* Editor Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "Edit FAQ" : "Add FAQ"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => saveFaq.mutate()}
              disabled={saveFaq.isPending}
            >
              {saveFaq.isPending ? "Saving..." : editingItem ? "Update FAQ" : "Add FAQ"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Question *</label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Do you provide free installation?" />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Answer *</label>
            <textarea 
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[120px]"
              placeholder="Provide a clear and concise answer..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Active (visible on website)
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
