import { FormEvent, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GalleryService, type GalleryImage } from "@/services/gallery.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";

export default function Gallery() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");

  const { data: items = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["admin-gallery"],
    queryFn: () => GalleryService.getAll(),
  });

  const addImage = useMutation({
    mutationFn: () => {
      const src = imagePreview || imageUrl.trim();
      if (!title.trim() || !src) throw new Error("Title and image are required.");
      if (!imagePreview) {
        try { new URL(src); } catch { throw new Error("Enter a valid image URL."); }
      }
      return GalleryService.create({ title: title.trim(), imageUrl: src, category: category.trim() || "General", isActive: true });
    },
    onSuccess: () => {
      setTitle(""); setImageUrl(""); setImagePreview(""); setCategory("General"); setError("");
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteImage = useMutation({
    mutationFn: (id: number) => GalleryService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  const toggleActive = useMutation({
    mutationFn: (item: GalleryImage) => GalleryService.update(item.id, { isActive: !item.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target?.result as string); setImageUrl(""); };
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => { e.preventDefault(); setError(""); addImage.mutate(); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        subtitle="Manage website gallery imagery with upload, categorize, and publish controls."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Gallery images"
          description="Manage existing gallery items and toggle visibility as needed."
        >
          {isLoading ? (
            <div className="mt-6 text-slate-500">Loading gallery…</div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className={`overflow-hidden rounded-3xl border transition-all ${item.isActive ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-200 bg-white opacity-60"}`}>
                  <div className="relative">
                    <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" />
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold bg-slate-900/70 px-2 py-1 rounded-full">Hidden</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => toggleActive.mutate(item)}
                        className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                        {item.isActive ? "Hide" : "Show"}
                      </button>
                      <button type="button" onClick={() => { if (window.confirm("Delete this image?")) deleteImage.mutate(item.id); }}
                        className="rounded-2xl bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {items.length === 0 && <p className="text-sm text-slate-500">No gallery images yet.</p>}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Add image"
          description="Upload new images or use a URL to add them instantly."
        >
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Image Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Upload from device</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Or paste image URL</label>
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(""); }} placeholder="https://image-url"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            {(imagePreview || imageUrl) && (
              <img src={imagePreview || imageUrl} alt="preview" className="h-32 w-full rounded-2xl object-contain bg-slate-100 border border-slate-200" />
            )}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Products / Gallery / Service"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
            </div>
            <button type="submit" disabled={addImage.isPending}
              className="w-full rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
              {addImage.isPending ? "Adding…" : "Add image"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
