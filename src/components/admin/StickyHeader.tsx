// src/components/admin/StickyHeader.tsx
import React from "react";
import { motion } from "framer-motion";

interface StickyHeaderProps {
  title: string;
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => void;
  onSaveDraft?: () => void;
  onCancel: () => void;
}

export default function StickyHeader({
  title,
  isSaving,
  isDirty,
  onSave,
  onSaveDraft,
  onCancel,
}: StickyHeaderProps) {
  return (
    <motion.div
      className="sticky top-0 z-20 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      <div className="flex items-center space-x-2">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={!isDirty || isSaving}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          >
            Save Draft
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
