import { ReactNode } from "react";

interface DataTableProps {
  children: ReactNode;
  className?: string;
}

export default function DataTable({ children, className = "" }: DataTableProps) {
  return (
    <div className={`mt-6 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}
