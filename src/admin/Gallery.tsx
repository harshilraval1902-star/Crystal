import React, { useState } from "react";
import { LayoutGrid, List, Search, Filter, Trash2, Image as ImageIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GalleryService, type GalleryImage } from "@/services/gallery.service";
import apiClient from "@/lib/api";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { BlockCard } from "@/components/admin/ui/Card";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { UploadZone } from "@/components/admin/gallery/UploadZone";
import { MediaDetailDrawer } from "@/components/admin/gallery/MediaDetailDrawer";
import { useToast } from "@/components/admin/ToastProvider";

export default function Gallery() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: items = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["admin-gallery"],
    queryFn: () => GalleryService.getAll(),
  });

  const filteredItems = items.filter(item => 
    !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const addImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await apiClient.post<{ url: string }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const fileName = file.name.split('.').slice(0, -1).join('.');

      return GalleryService.create({
        title: fileName || "Uploaded Image",
        imageUrl: response.data.url,
        category: "General",
        isActive: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      notify({ title: "Upload complete", description: "Image added to gallery.", variant: "success" });
    },
    onError: (e: Error) => {
      notify({ title: "Upload failed", description: e.message, variant: "error" });
    },
  });

  const deleteImage = useMutation({
    mutationFn: (id: number) => GalleryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      notify({ title: "Image deleted", description: "Image removed from gallery.", variant: "success" });
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== deleteImage.variables));
      setIsDrawerOpen(false);
    },
  });

  const toggleActive = useMutation({
    mutationFn: (item: GalleryImage) => GalleryService.update(item.id, { isActive: !item.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      notify({ title: "Visibility updated", description: "Image status updated.", variant: "success" });
    },
  });

  const handleImageClick = (item: GalleryImage, e: React.MouseEvent) => {
    // If we click on the checkbox itself, don't open drawer
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
    setSelectedImage(item);
    setIsDrawerOpen(true);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} images?`)) {
      selectedIds.forEach(id => deleteImage.mutate(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-gray-500">Manage images used across products, pages, and content.</p>
        </div>
      </div>

      <BlockCard className="p-0 overflow-hidden border-0 bg-transparent">
        <UploadZone 
          onFileSelect={(file) => addImage.mutate(file)} 
          isUploading={addImage.isPending}
        />
      </BlockCard>

      <BlockCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1 w-full flex items-center space-x-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search images by name..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button variant="secondary" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-2 flex items-center justify-between animate-in fade-in slide-in-from-top-4 mb-4">
            <span className="text-sm font-medium text-primary-700 px-2">{selectedIds.length} item(s) selected</span>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${selectedIds.includes(item.id) ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent bg-gray-50'}`}
                  onClick={(e) => handleImageClick(item, e)}
                >
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Select Checkbox (always visible if selected, visible on hover if not) */}
                  <div className={`absolute top-2 right-2 z-10 ${selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shadow-sm cursor-pointer"
                    />
                  </div>

                  {/* Status Overlay */}
                  {!item.isActive && (
                    <div className="absolute top-2 left-2 rounded-md bg-gray-900/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                      Hidden
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p className="truncate text-xs font-medium text-white">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">Image</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Details</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredItems.map(item => (
                    <tr key={item.id} className={`hover:bg-gray-50 cursor-pointer ${selectedIds.includes(item.id) ? 'bg-primary-50/30' : ''}`} onClick={(e) => handleImageClick(item, e)}>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{item.imageUrl}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.isActive ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.isActive ? "Published" : "Hidden"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <EmptyState 
            icon={ImageIcon}
            title="No images found" 
            description={search ? "Try adjusting your search criteria." : "Upload some images to start building your media library."}
            actionLabel={search ? "Clear Search" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        )}
      </BlockCard>

      <MediaDetailDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        image={selectedImage}
        onDelete={(id) => deleteImage.mutate(id)}
        onToggleActive={(item) => toggleActive.mutate(item)}
      />
    </div>
  );
}
