import { ReactNode } from "react";

interface SectionCardProps {
  id?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ id, title, description, actions, children, className = "" }: SectionCardProps) {
  return (
    <section id={id} className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}>
      {(title || description || actions) && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            {title && <h2 className="text-xl font-semibold text-slate-950">{title}</h2>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
