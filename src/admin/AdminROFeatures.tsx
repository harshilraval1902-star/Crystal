import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { ROFeature, ROFeatureService } from "@/services/roFeature.service";

export default function AdminROFeatures() {
  const [features, setFeatures] = useState<ROFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", iconName: "", displayOrder: 0, isActive: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await ROFeatureService.getAllAdmin();
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching features", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await ROFeatureService.update(currentId, formData);
      } else {
        await ROFeatureService.create(formData);
      }
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ title: "", description: "", iconName: "", displayOrder: 0, isActive: true });
      fetchData();
    } catch (error) {
      alert("Failed to save feature.");
    }
  };

  const handleEdit = (feature: ROFeature) => {
    setIsEditing(true);
    setCurrentId(feature.id);
    setFormData({ title: feature.title, description: feature.description, iconName: feature.iconName ?? "", displayOrder: feature.displayOrder, isActive: feature.isActive });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;
    try {
      await ROFeatureService.delete(id);
      fetchData();
    } catch (error) {
      alert("Failed to delete feature.");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage RO Features</h1>
        <p className="text-slate-500">Update the technology features displayed on the Home page.</p>
      </div>

      {/* Feature Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? "Edit Feature" : "Add New Feature"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lucide Icon Name (e.g. Layers, Zap)</label>
            <input type="text" value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={3}></textarea>
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
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ title: "", description: "", iconName: "", displayOrder: 0, isActive: true }); }} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            )}
            <button type="submit" className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> {isEditing ? "Update Feature" : "Add Feature"}
            </button>
          </div>
        </form>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase text-slate-500">
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Icon</th>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map(feature => (
              <tr key={feature.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{feature.title}</td>
                <td className="px-6 py-4 text-slate-600">{feature.iconName}</td>
                <td className="px-6 py-4 text-slate-600">{feature.displayOrder}</td>
                <td className="px-6 py-4">
                  {feature.isActive ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-slate-300" />}
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(feature)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(feature.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {features.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No features found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
