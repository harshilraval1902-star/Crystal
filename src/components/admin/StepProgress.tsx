// src/components/admin/StepProgress.tsx
import React from "react";
import { motion } from "framer-motion";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export default function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 text-center">
          <motion.div
            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
              idx === currentStep
                ? "bg-indigo-600 text-white"
                : idx < currentStep
                ? "bg-indigo-200 text-indigo-800"
                : "bg-gray-200 text-gray-500"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {idx + 1}
          </motion.div>
          <span className="text-xs mt-1 block text-gray-600 dark:text-gray-300">{label}</span>
        </div>
      ))}
    </div>
  );
}
