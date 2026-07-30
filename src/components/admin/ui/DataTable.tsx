import React, { createContext, useContext, useState } from "react";
import { cn } from "./Button";
import { Search, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { useTableDensity, DensityType } from "@/hooks/useTableDensity";
import { DensitySelector } from "./DensitySelector";

export interface DensityContextValue {
  density: DensityType;
  paddingClass: string;
}

export const DensityContext = createContext<DensityContextValue>({
  density: "normal",
  paddingClass: "py-3 px-4 text-sm",
});

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-gray-100 bg-gray-50/50", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-gray-100 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-primary-50", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  const { paddingClass } = useContext(DensityContext);
  return (
    <th
      className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0", paddingClass, className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const { paddingClass } = useContext(DensityContext);
  return (
    <td
      className={cn("align-middle [&:has([role=checkbox])]:pr-0", paddingClass, className)}
      {...props}
    />
  );
}

// Higher level DataTable component that puts it all together
export interface DataTableProps {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  densityKey?: string;
}

export function DataTable({ 
  title, 
  description, 
  searchPlaceholder = "Search...", 
  onSearch, 
  actions, 
  children,
  selectedCount = 0,
  bulkActions,
  pagination,
  densityKey
}: DataTableProps) {
  const { density, setDensity, paddingClass } = useTableDensity(densityKey ?? "table", "normal");
  const [showConfig, setShowConfig] = useState(false);

  return (
    <DensityContext.Provider value={{ density, paddingClass }}>
      <div className="flex flex-col space-y-4 relative">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center space-x-2">
            {onSearch && (
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder={searchPlaceholder} 
                  className="pl-9 bg-white shadow-sm" 
                  onChange={(e) => onSearch(e.target.value)} 
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 shrink-0 justify-end w-full sm:w-auto">
            {actions}
            {densityKey && (
              <div className="relative">
                <Button variant="secondary" size="sm" onClick={() => setShowConfig(!showConfig)}>
                  <Settings2 className="h-4 w-4 mr-2" />
                  View Options
                </Button>
                {showConfig && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-4 z-20">
                    <DensitySelector density={density} onChange={setDensity} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedCount > 0 && bulkActions && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-2 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <span className="text-sm font-medium text-primary-700 px-2">{selectedCount} row(s) selected</span>
            <div className="flex items-center gap-2">
              {bulkActions}
            </div>
          </div>
        )}

        {/* Table Container - with sticky header support */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col relative">
          <div className="overflow-auto max-h-[600px] w-full custom-scrollbar relative">
            <div className="w-full min-w-max [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:shadow-sm">
              {children}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="text-sm text-gray-500 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={pagination.currentPage <= 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="shadow-sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DensityContext.Provider>
  );
}
