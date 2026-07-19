// src/components/admin/ActionMenu.tsx
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

interface ActionItem {
  label: string;
  onClick: () => void;
}

export default function ActionMenu({ items }: { items: ActionItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex items-center rounded-full p-1 hover:bg-slate-100"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
