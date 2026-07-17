import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewService, type Review } from "@/services/review.service";
import { ProductService } from "@/services/product.service";
import { Star } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

const statusColors: Record<Review["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function Reviews() {
  const qc = useQueryClient();
  const [productId, setProductId] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState<Review["status"]>("approved");

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: () => ProductService.getAll(),
  });

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["admin-reviews"],
    queryFn: () => ReviewService.getAll(),
  });

  const createReview = useMutation({
    mutationFn: () =>
      ReviewService.create({
        productId: Number(productId),
        customerName,
        rating,
        reviewText,
        status,
      }),
    onSuccess: () => {
      setProductId(""); setCustomerName(""); setRating(5); setReviewText(""); setStatus("approved");
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const setReviewStatus = useMutation({
    mutationFn: ({ id, s }: { id: number; s: Review["status"] }) => ReviewService.update(id, { status: s }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const deleteReview = useMutation({
    mutationFn: (id: number) => ReviewService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const productName = (id: number) => products.find((p) => p.id === id)?.name ?? `Product #${id}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle="Manage, approve, and moderate customer reviews shown on the website."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="All reviews"
          description="Review and moderate customer feedback in a unified admin workspace."
        >
          {isLoading ? (
            <div className="mt-6 text-slate-500">Loading reviews…</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] divide-y divide-slate-200 text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-3 font-medium text-slate-500">Product</th>
                    <th className="py-3 font-medium text-slate-500">Customer</th>
                    <th className="py-3 font-medium text-slate-500">Rating</th>
                    <th className="py-3 font-medium text-slate-500">Status</th>
                    <th className="py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reviews.map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-slate-900 text-xs">{productName(r.productId)}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-[160px] truncate">{r.reviewText}</div>
                      </td>
                      <td className="py-4 pr-4 text-slate-700">{r.customerName}</td>
                      <td className="py-4 pr-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 space-x-1.5">
                        {r.status !== "approved" && (
                          <button onClick={() => setReviewStatus.mutate({ id: r.id, s: "approved" })}
                            className="rounded-2xl bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">
                            Approve
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button onClick={() => setReviewStatus.mutate({ id: r.id, s: "rejected" })}
                            className="rounded-2xl bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200">
                            Reject
                          </button>
                        )}
                        <button onClick={() => deleteReview.mutate(r.id)}
                          className="rounded-2xl bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-500">No reviews yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Add review"
          description="Publish new customer reviews and control whether they appear on the site."
        >
          <form onSubmit={(e) => { e.preventDefault(); createReview.mutate(); }} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Product</label>
              <select required value={productId} onChange={(e) => setProductId(Number(e.target.value))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                <option value="">Select product…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Customer Name</label>
              <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Rating (1–5)</label>
                <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as Review["status"])}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Review Text</label>
              <textarea required rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <button type="submit" disabled={createReview.isPending}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {createReview.isPending ? "Saving…" : "Add Review"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
