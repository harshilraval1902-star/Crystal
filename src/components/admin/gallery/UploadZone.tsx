import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "../ui/Button";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function UploadZone({ onFileSelect, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
        isDragging ? "border-primary-500 bg-primary-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100",
        isUploading && "pointer-events-none opacity-60"
      )}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleChange} 
      />
      
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
        <UploadCloud className="h-6 w-6 text-primary-600" />
      </div>
      
      <p className="text-sm font-semibold text-gray-900">
        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        SVG, PNG, JPG or GIF (max. 10MB)
      </p>
    </div>
  );
}
