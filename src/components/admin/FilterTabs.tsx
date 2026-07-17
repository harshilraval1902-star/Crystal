interface FilterTabsProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

export default function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-3xl border px-4 py-2 text-sm font-medium transition ${
            value === option.value
              ? "border-blue-300 bg-blue-600 text-white"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
