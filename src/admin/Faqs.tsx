import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaqService, type Faq } from "@/services/content.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

const CATEGORIES = ["AMC", "General", "Products", "Service"];

export default function Faqs() {
  const qc = useQueryClient();
  const [editId, setEditId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [isActive, setIsActive] = useState(true);

  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ["admin-faqs"],
    queryFn: () => FaqService.getAll(),
  });

  const resetForm = () => { setEditId(null); setQuestion(""); setAnswer(""); setCategory("General"); setIsActive(true); };

  const saveFaq = useMutation({
    mutationFn: () =>
      editId !== null
        ? FaqService.update(editId, { question, answer, category, isActive })
        : FaqService.create({ question, answer, category, isActive, displayOrder: faqs.length }),
    onSuccess: () => { resetForm(); qc.invalidateQueries({ queryKey: ["admin-faqs"] }); },
  });

  const deleteFaq = useMutation({
    mutationFn: (id: number) => FaqService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => FaqService.update(id, { isActive: !active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  const startEdit = (faq: Faq) => {
    setEditId(faq.id); setQuestion(faq.question); setAnswer(faq.answer);
    setCategory(faq.category); setIsActive(faq.isActive);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        subtitle="Manage FAQ entries shown on the AMC plans page and other sections."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="FAQ list"
          description="Manage frequently asked questions and keep website help content up to date."
        >
          {isLoading ? <div className="mt-6 text-slate-500">Loading…</div> : (
            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className={`rounded-3xl border p-5 transition-all ${faq.isActive ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-200 bg-white opacity-60"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{faq.category}</span>
                        {!faq.isActive && <span className="text-xs text-slate-400">Hidden</span>}
                      </div>
                      <p className="font-semibold text-slate-900 text-sm">{faq.question}</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => startEdit(faq)}
                        className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                        Edit
                      </button>
                      <button onClick={() => toggleActive.mutate({ id: faq.id, active: faq.isActive })}
                        className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                        {faq.isActive ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => deleteFaq.mutate(faq.id)}
                        className="rounded-2xl bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {faqs.length === 0 && <p className="text-sm text-slate-500">No FAQs yet.</p>}
            </div>
          )}
        </SectionCard>

        <SectionCard title={editId ? "Edit FAQ" : "Add FAQ"}>
          <form onSubmit={(e) => { e.preventDefault(); saveFaq.mutate(); }} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Question</label>
              <input required value={question} onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Answer</label>
              <textarea required rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
              Active (visible on website)
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saveFaq.isPending}
                className="flex-1 inline-flex items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                {saveFaq.isPending ? "Saving…" : editId ? "Update FAQ" : "Add FAQ"}
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
