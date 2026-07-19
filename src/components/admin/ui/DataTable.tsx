import React from "react";
import { cn } from "./Button";
import { Search, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

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
  return (
    <th
      className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
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
  pagination 
}: DataTableProps) {
  return (
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
        <div className="flex items-center space-x-2 shrink-0">
          {actions}
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
          {/* Ensure table elements inside this wrapper have sticky headers by using [&_thead]:sticky [&_thead]:top-0 */}
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
  );
}
