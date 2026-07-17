interface StatusBadgeProps {
  status: string;
}

const badgeStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  featured: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  disabled: "bg-slate-100 text-slate-500",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[key] ?? "bg-slate-100 text-slate-500"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
