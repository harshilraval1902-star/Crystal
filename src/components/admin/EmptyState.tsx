import { ReactNode } from "react";
import { SmilePlus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
        <SmilePlus className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
