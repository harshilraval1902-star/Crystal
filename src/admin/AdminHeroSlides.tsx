import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, UploadCloud } from "lucide-react";
import { HeroSlide, HeroSlideService } from "@/services/heroSlide.service";
import { SettingsService } from "@/services/settings.service";
import apiClient from "@/lib/api";

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [bgImage, setBgImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", imgUrl: "", displayOrder: 0, isActive: true });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slidesData, bgSetting] = await Promise.all([
        HeroSlideService.getAllAdmin(),
        SettingsService.getById("hero_bg_image")
      ]);
      setSlides(slidesData);
      setBgImage(bgSetting ?? "");
    } catch (error) {
      console.error("Error fetching hero slides", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBg = async () => {
    try {
      await SettingsService.update("hero_bg_image", { hero_bg_image: bgImage });
      alert("Background image updated successfully!");
    } catch (error) {
      alert("Failed to update background image.");
    }
  };

  const handleFileUpload = async (file: File, isBg: boolean = false) => {
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file);
      const res = await apiClient.post<{ url: string }>("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (isBg) {
        setBgImage(res.data.url);
      } else {
        setFormData({ ...formData, imgUrl: res.data.url });
      }
    } catch (error: any) {
      alert("Failed to upload image: " + (error?.message || "Unknown error"));
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await HeroSlideService.update(currentId, formData);
      } else {
        await HeroSlideService.create(formData);
      }
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ name: "", imgUrl: "", displayOrder: 0, isActive: true });
      fetchData();
    } catch (error) {
      alert("Failed to save slide.");
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setIsEditing(true);
    setCurrentId(slide.id);
    setFormData({ name: slide.name, imgUrl: slide.imgUrl, displayOrder: slide.displayOrder, isActive: slide.isActive });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await HeroSlideService.delete(id);
      fetchData();
    } catch (error) {
      alert("Failed to delete slide.");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Hero Slides</h1>
        <p className="text-slate-500">Update the dynamic purifiers and background image shown on the Home page.</p>
      </div>

      {/* Global Background Settings */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Hero Background Image</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL or Upload</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={bgImage} 
                onChange={(e) => setBgImage(e.target.value)} 
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="/uploads/bg.png or https://..."
              />
              <label className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer border border-slate-300">
                <UploadCloud className="w-5 h-5 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], true)} />
              </label>
            </div>
          </div>
          <button onClick={handleSaveBg} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Save Background
          </button>
        </div>
      </div>

      {/* Slide Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? "Edit Slide" : "Add New Slide"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purifier Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL or Upload (Transparent PNG)</label>
            <div className="flex items-center gap-2">
              <input required type="text" value={formData.imgUrl} onChange={e => setFormData({...formData, imgUrl: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg" />
              <label className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer border border-slate-300">
                <UploadCloud className="w-5 h-5 mr-2" />
                {isUploading ? "Uploading..." : "Upload PNG"}
                <input type="file" className="hidden" accept="image/png" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], false)} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
            <input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
              <span className="ml-2 text-slate-700 font-medium">Active</span>
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: "", imgUrl: "", displayOrder: 0, isActive: true }); }} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            )}
            <button type="submit" className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> {isEditing ? "Update Slide" : "Add Slide"}
            </button>
          </div>
        </form>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500">
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slides.map(slide => (
              <tr key={slide.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4"><img src={slide.imgUrl} alt={slide.name} className="h-12 w-auto object-contain" /></td>
                <td className="px-6 py-4 font-medium text-slate-800">{slide.name}</td>
                <td className="px-6 py-4 text-slate-600">{slide.displayOrder}</td>
                <td className="px-6 py-4">
                  {slide.isActive ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-slate-300" />}
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No slides found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
