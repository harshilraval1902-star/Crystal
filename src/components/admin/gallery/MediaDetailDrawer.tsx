import React from "react";
import { Drawer } from "../ui/Drawer";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Trash2, Copy, Download, ExternalLink } from "lucide-react";
import type { GalleryImage } from "@/services/gallery.service";
import { useToast } from "../ToastProvider";

interface MediaDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage | null;
  onDelete: (id: number) => void;
  onToggleActive: (image: GalleryImage) => void;
}

export function MediaDetailDrawer({ isOpen, onClose, image, onDelete, onToggleActive }: MediaDetailDrawerProps) {
  const { notify } = useToast();

  if (!image) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image.imageUrl);
    notify({ title: "URL copied", description: "Image URL copied to clipboard.", variant: "success" });
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Media Details" 
      size="md"
      footer={
        <>
          <Button variant="danger" className="mr-auto" onClick={() => {
            onDelete(image.id);
            onClose();
          }}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={() => onToggleActive(image)}>
            {image.isActive ? "Hide Image" : "Publish Image"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        
        {/* Preview */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-2 overflow-hidden">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
            <img src={image.imageUrl} alt={image.title} className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
            <p className="text-sm font-medium text-gray-900">{image.title}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
            <p className="text-sm text-gray-700">{image.category}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${image.isActive ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>
              {image.isActive ? "Published" : "Hidden"}
            </span>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">File URL</label>
            <div className="flex gap-2">
              <Input value={image.imageUrl} readOnly className="text-xs bg-gray-50" />
              <Button variant="secondary" size="icon" onClick={handleCopyUrl} title="Copy URL">
                <Copy className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Open in new tab
          </a>
        </div>

      </div>
    </Drawer>
  );
}
