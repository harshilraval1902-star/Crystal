import React, { useState, useEffect } from "react";
import { 
  Search, Trash2, Mail, Calendar, CheckCircle, XCircle, 
  Download, Eye, RefreshCw, Settings2, Copy, Check, 
  ChevronRight, ArrowUpRight, TrendingUp, Info, ListFilter
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriberService, type Subscriber } from "@/services/subscriber.service";
import { Button } from "@/components/admin/ui/Button";
import { Drawer } from "@/components/admin/ui/Drawer";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";
import { useTableDensity } from "@/hooks/useTableDensity";
import { DensitySelector } from "@/components/admin/ui/DensitySelector";


export default function Subscribers() {
  const qc = useQueryClient();
  const { notify } = useToast();

  // Search & Pagination & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Filters
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI Customizations
  const { density, setDensity, paddingClass } = useTableDensity("subscribers", "normal");
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("subscribers-visible-columns");
    return saved ? JSON.parse(saved) : { id: true, email: true, status: true, date: true, actions: true };
  });

  // Action/Details States
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewSubscriber, setViewSubscriber] = useState<Subscriber | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    localStorage.setItem("subscribers-visible-columns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch paginated & filtered data
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["admin-subscribers", page, limit, debouncedSearch, sort, order, filter, startDate, endDate],
    queryFn: () => SubscriberService.getAll({
      page,
      limit,
      search: debouncedSearch,
      sort,
      order,
      filter,
      startDate,
      endDate
    }),
  });

  // Mutate single delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => SubscriberService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscribers"] });
      notify({ title: "Subscriber deleted", description: "The subscriber has been removed.", variant: "success" });
      setViewSubscriber(null);
    },
    onError: (err: any) => {
      notify({ title: "Deletion failed", description: err.message, variant: "error" });
    }
  });

  // Mutate bulk delete
  const deleteBulkMutation = useMutation({
    mutationFn: (ids: number[]) => SubscriberService.deleteBulk(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscribers"] });
      notify({ title: "Bulk delete completed", description: `${selectedIds.length} subscribers removed.`, variant: "success" });
      setSelectedIds([]);
    },
    onError: (err: any) => {
      notify({ title: "Bulk deletion failed", description: err.message, variant: "error" });
    }
  });

  const handleSelectAll = (checked: boolean, items: Subscriber[]) => {
    if (checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleCopyEmail = (email: string, id: number) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    notify({ title: "Email copied", description: "Email address copied to clipboard.", variant: "success" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("desc");
    }
    setPage(1);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} subscribers? This action cannot be undone.`)) {
      deleteBulkMutation.mutate(selectedIds);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await SubscriberService.export({
        search: debouncedSearch,
        sort,
        order,
        filter,
        startDate,
        endDate
      });

      const csvRows = [
        ["ID", "Email", "Status", "Subscription Date"],
        ...exportData.map(sub => [
          sub.id,
          sub.email,
          sub.isActive ? "Active" : "Inactive",
          new Date(sub.createdAt).toLocaleDateString()
        ])
      ];

      const csvContent = "data:text/csv;charset=utf-8," 
        + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `subscribers-${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify({ title: "Export completed", description: `${exportData.length} records successfully exported.`, variant: "success" });
    } catch (err: any) {
      notify({ title: "Export failed", description: err.message || "Failed to export data.", variant: "error" });
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-100 text-yellow-900 rounded-[2px] px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev: any) => ({ ...prev, [col]: !prev[col] }));
  };

  const getCellPadding = () => paddingClass;

  if (error) return <div className="p-8 text-danger-600 font-medium">Failed to load subscribers.</div>;

  const stats = data?.stats || { totalSubscribers: 0, newThisWeek: 0, newThisMonth: 0, growthPercent: 0 };
  const subscribers = data?.subscribers || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Mail className="h-6 w-6 text-brand-primary" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-500">Manage, sort, filter, and export newsletter subscription list.</p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isLoading || isRefetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={isLoading || totalCount === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: stats.totalSubscribers, desc: "Active newsletter list", icon: Mail },
          { label: "New This Week", value: stats.newThisWeek, desc: "Registered last 7 days", icon: Calendar },
          { label: "New This Month", value: stats.newThisMonth, desc: "Registered last 30 days", icon: ArrowUpRight },
          { label: "Growth", value: `${stats.growthPercent}%`, desc: "Growth this month", icon: TrendingUp, trend: true }
        ].map((c, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</span>
              <h2 className="text-2xl font-bold text-slate-800">{isLoading ? "..." : c.value}</h2>
              <span className="text-xs text-slate-400 block">{c.desc}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
              <c.icon className="h-5 w-5 text-brand-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Search & Filter inputs */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search email..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary w-full"
              />
            </div>

            {/* Quick date filters */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary appearance-none cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range...</option>
              </select>
              <ListFilter className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Custom Date Inputs */}
            {filter === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Right: Actions, Density, Column options */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            {selectedIds.length > 0 && (
              <Button variant="secondary" size="sm" className="text-danger-600 bg-danger-50 hover:bg-danger-100 border-danger-200" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            )}

            {/* Column Options dropdown toggle */}
            <div className="relative">
              <Button variant="secondary" size="sm" onClick={() => setShowConfig(!showConfig)}>
                <Settings2 className="h-4 w-4 mr-2" />
                View Options
              </Button>

              {showConfig && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-4 z-20 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Visible Columns</span>
                    <div className="space-y-1.5">
                      {[
                        { key: "id", label: "Subscriber ID" },
                        { key: "email", label: "Email Address" },
                        { key: "status", label: "Status" },
                        { key: "date", label: "Subscription Date" },
                        { key: "actions", label: "Actions" }
                      ].map(c => (
                        <label key={c.key} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(visibleColumns as any)[c.key]}
                            onChange={() => toggleColumn(c.key)}
                            className="rounded text-brand-primary focus:ring-brand-primary"
                          />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <DensitySelector density={density} onChange={setDensity} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 w-[40px]">
                  <input
                    type="checkbox"
                    checked={subscribers.length > 0 && selectedIds.length === subscribers.length}
                    onChange={(e) => handleSelectAll(e.target.checked, subscribers)}
                    className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  />
                </th>
                {visibleColumns.id && (
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[80px]">
                    ID
                  </th>
                )}
                {visibleColumns.email && (
                  <th 
                    className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 transition-colors select-none"
                    onClick={() => handleSort("email")}
                  >
                    <span className="flex items-center gap-1.5">
                      Email Address
                      {sort === "email" && (order === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[150px]">
                    Status
                  </th>
                )}
                {visibleColumns.date && (
                  <th 
                    className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 transition-colors select-none w-[180px]"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1.5">
                      Subscription Date
                      {sort === "createdAt" && (order === "asc" ? "▲" : "▼")}
                    </span>
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[140px]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <SkeletonText lines={4} className="max-w-md mx-auto" />
                  </TableCell>
                </TableRow>
              ) : subscribers.length > 0 ? (
                subscribers.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="hover:bg-slate-50/70 border-b border-slate-100 transition-colors cursor-pointer group"
                    onClick={() => setViewSubscriber(item)}
                  >
                    <TableCell className={getCellPadding()} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleSelectRow(e.target.checked, item.id)}
                        className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </TableCell>
                    {visibleColumns.id && (
                      <TableCell className={getCellPadding()}>
                        <span className="font-mono text-xs text-slate-400">#{item.id}</span>
                      </TableCell>
                    )}
                    {visibleColumns.email && (
                      <TableCell className={getCellPadding()}>
                        <div className="flex items-center gap-2 max-w-sm truncate">
                          <span className="font-medium text-slate-700">
                            {highlightText(item.email, debouncedSearch)}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell className={getCellPadding()}>
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.date && (
                      <TableCell className={getCellPadding()}>
                        <div className="text-slate-600 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.actions && (
                      <TableCell className={`${getCellPadding()} text-right`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopyEmail(item.email, item.id)} 
                            title="Copy email"
                          >
                            {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-400" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setViewSubscriber(item)} 
                            title="View details"
                          >
                            <Eye className="h-4 w-4 text-slate-400 hover:text-brand-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (confirm(`Delete subscriber ${item.email}? This action cannot be undone.`)) {
                                deleteMutation.mutate(item.id);
                              }
                            }} 
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-danger-400 hover:text-danger-600" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48">
                    <EmptyState 
                      title="No subscribers found" 
                      description={searchTerm ? "Try adjusting your search criteria." : "You have no newsletter subscribers."}
                    />
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="py-1 px-2 border border-slate-200 rounded focus:outline-none"
            >
              {[5, 10, 20, 50].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div>
            Showing <span className="font-semibold text-slate-700">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{Math.min(page * limit, totalCount)}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalCount}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pIdx = idx + 1;
              return (
                <button
                  key={pIdx}
                  onClick={() => setPage(pIdx)}
                  className={`h-8 w-8 text-sm font-semibold rounded-md border transition-all ${page === pIdx ? "bg-brand-primary text-white border-brand-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {pIdx}
                </button>
              );
            })}
            <Button
              variant="secondary"
              size="sm"
              disabled={page === totalPages || isLoading}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Details Side Drawer */}
      <Drawer
        isOpen={!!viewSubscriber}
        onClose={() => setViewSubscriber(null)}
        title={`Subscriber #${viewSubscriber?.id}`}
        size="md"
        footer={
          <div className="w-full flex justify-between items-center">
            <Button variant="secondary" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 border-transparent shadow-none" onClick={() => {
              if (viewSubscriber && confirm(`Delete subscriber ${viewSubscriber.email}?`)) {
                deleteMutation.mutate(viewSubscriber.id);
              }
            }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Subscriber
            </Button>
            <Button variant="secondary" onClick={() => setViewSubscriber(null)}>Close</Button>
          </div>
        }
      >
        {viewSubscriber && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200/50 pb-3">
                <div className="h-10 w-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{viewSubscriber.email}</h3>
                  <span className="text-xs text-slate-400">Newsletter Subscription Profile</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Subscriber ID</span>
                  <span className="font-mono text-slate-800">#{viewSubscriber.id}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                    <CheckCircle className="h-3 w-3" /> Active
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Created At</span>
                  <span className="text-slate-700">{new Date(viewSubscriber.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Last Updated</span>
                  <span className="text-slate-700">{new Date(viewSubscriber.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Subscriber Information</h4>
                <p className="leading-relaxed">This subscriber will receive automatic notifications, brand updates, maintenance tips, and special service promotions sent via registered email campaigns.</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
