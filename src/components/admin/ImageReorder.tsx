// src/components/admin/ImageReorder.tsx
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageItem {
  id: string; // unique id (e.g., file name + index)
  file: File;
  preview: string; // object URL
}

interface ImageReorderProps {
  items: ImageItem[];
  onChange: (newItems: ImageItem[]) => void;
}

function SortableImage({ id, file, preview }: ImageItem) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-1">
      <img src={preview} alt={file.name} className="w-24 h-24 object-cover rounded" />
    </div>
  );
}

export default function ImageReorder({ items, onChange }: ImageReorderProps) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-wrap gap-2">{items.map((item) => (
          <SortableImage key={item.id} {...item} />
        ))}</div>
      </SortableContext>
    </DndContext>
  );
}
