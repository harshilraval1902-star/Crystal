import { useState, useEffect } from "react";

export type DensityType = "compact" | "normal" | "spacious";

export function useTableDensity(key: string, defaultValue: DensityType = "normal") {
  const [density, setDensity] = useState<DensityType>(() => {
    return (localStorage.getItem(`${key}-density`) as DensityType) || defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(`${key}-density`, density);
  }, [key, density]);

  const getPaddingClass = () => {
    if (density === "compact") return "py-2 px-3 text-xs";
    if (density === "spacious") return "py-5 px-5 text-base";
    return "py-3 px-4 text-sm";
  };

  return { density, setDensity, paddingClass: getPaddingClass() };
}
