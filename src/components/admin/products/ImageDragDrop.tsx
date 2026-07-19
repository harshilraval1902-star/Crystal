import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface SortableItemProps {
  id: string;
  url: string;
  onRemove: (id: string) => void;
}

function SortableItem({ id, url, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 ${isDragging ? 'opacity-50 ring-2 ring-primary-500' : ''}`}>
      <img src={url} alt="Product media" className="w-full h-full object-cover" />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex justify-end">
          <button 
            type="button" 
            onClick={() => onRemove(id)}
            className="p-1.5 bg-white/20 hover:bg-danger-500 rounded-lg text-white backdrop-blur-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center">
          <button 
            type="button" 
            {...attributes} 
            {...listeners} 
            className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-sm cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ImageDragDropProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageDragDrop({ images, onChange }: ImageDragDropProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter(img => img !== id));
  };

  if (images.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((url) => (
            <SortableItem key={url} id={url} url={url} onRemove={removeImage} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
