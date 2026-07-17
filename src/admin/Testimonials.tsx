import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TestimonialService, type Testimonial } from "@/services/testimonial.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

export default function Testimonials() {
  const [customerName, setCustomerName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState("");
  const [designation, setDesignation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["admin-testimonials"],
    queryFn: () => TestimonialService.getAll(),
  });

  const createTestimonial = useMutation({
    mutationFn: () => TestimonialService.create({
        customerName,
        review,
        rating,
        location: location || undefined,
        designation: designation || undefined,
        photoUrl: photoUrl || undefined,
        isActive,
        displayOrder: data?.length ?? 0,
      }),
    onSuccess: () => {
      setCustomerName("");
      setReview("");
      setRating(5);
      setLocation("");
      setDesignation("");
      setPhotoUrl("");
      setIsActive(true);
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Testimonial> }) => TestimonialService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: number) => TestimonialService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        subtitle="Review and publish customer testimonials for the website."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Testimonials"
          description="Manage customer testimonials with a clean and scalable content workspace."
        >
          {isLoading ? (
            <div className="mt-6 text-slate-500">Loading testimonials…</div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load testimonials.</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px] divide-y divide-slate-200 text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-3 font-medium text-slate-500">Customer</th>
                    <th className="py-3 font-medium text-slate-500">Rating</th>
                    <th className="py-3 font-medium text-slate-500">Status</th>
                    <th className="py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 pr-6">
                        <div className="font-semibold text-slate-900">{item.customerName}</div>
                        <div className="text-xs text-slate-500">{item.designation ?? item.location ?? "Customer review"}</div>
                      </td>
                      <td className="py-4 pr-6 text-slate-700">{item.rating} / 5</td>
                      <td className="py-4 pr-6 text-slate-700">{item.isActive ? "Published" : "Hidden"}</td>
                      <td className="py-4 pr-6 space-x-2">
                        <button
                          type="button"
                          onClick={() => updateTestimonial.mutate({ id: item.id, payload: { isActive: !item.isActive } })}
                          className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          {item.isActive ? "Hide" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTestimonial.mutate(item.id)}
                          className="rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm text-slate-500">No testimonials available.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Add testimonial"
          description="Create fresh testimonial content and set publish visibility instantly."
        >
          <form onSubmit={(event) => {
            event.preventDefault();
            createTestimonial.mutate();
          }} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Customer name</label>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Review</label>
              <textarea
                value={review}
                onChange={(event) => setReview(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Rating</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Location</label>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Designation</label>
              <input
                value={designation}
                onChange={(event) => setDesignation(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Photo URL</label>
              <input
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
              <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
              Published
            </label>
            <button
              type="submit"
              disabled={createTestimonial.isPending}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {createTestimonial.isPending ? "Saving…" : "Add testimonial"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
