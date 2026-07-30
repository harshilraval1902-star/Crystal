import React from "react";
import { DensityType } from "@/hooks/useTableDensity";

interface DensitySelectorProps {
  density: DensityType;
  onChange: (density: DensityType) => void;
}

export function DensitySelector({ density, onChange }: DensitySelectorProps) {
  return (
    <div className="border-t border-slate-100 pt-3">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Row Density</span>
      <div role="group" aria-label="Row density selector" className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-100">
        {(["compact", "normal", "spacious"] as DensityType[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            aria-pressed={density === d}
            className={`flex-1 text-xs py-1 rounded-md font-medium transition-all ${
              density === d
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
export default DensitySelector;
