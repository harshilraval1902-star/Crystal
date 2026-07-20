import React, { useState, useMemo } from "react";
import {
  Eye, Filter, Trash2, Download, FileText,
  FileSpreadsheet, FileIcon, Calendar, ChevronDown,
  X, Phone, MapPin, Wrench, StickyNote,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookingService, type Booking } from "@/services/booking.service";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import {
  DataTable,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";
import {
  exportToCSV,
  exportToExcel,
  exportToODS,
} from "@/utils/exportUtils";

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  "New RO Installation",
  "RO Repair / Not Working",
  "Filter Replacement",
  "Membrane Replacement",
  "Annual Maintenance (AMC)",
  "RO Service / Cleaning",
  "Water TDS Testing",
  "General Checkup",
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Pending",      value: "new" },
  { label: "In Progress",  value: "in_progress" },
  { label: "Completed",    value: "completed" },
  { label: "Cancelled",    value: "cancelled" },
];

const STATUS_UPDATE_OPTIONS = [
  { label: "Pending",     value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed",   value: "completed" },
  { label: "Cancelled",   value: "cancelled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format raw DB id → BK-000001 */
function formatBookingId(id: number): string {
  return `BK-${String(id).padStart(6, "0")}`;
}

/** Map stored status values to human-readable display labels */
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    new:         "Pending",
    contacted:   "Contacted",
    in_progress: "In Progress",
    assigned:    "In Progress",
    completed:   "Completed",
    cancelled:   "Cancelled",
  };
  return map[status] ?? status;
}

/** Tailwind-based badge for each status */
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "new":
      return <Badge variant="urgent">Pending</Badge>;
    case "contacted":
      return <Badge variant="pending">Contacted</Badge>;
    case "in_progress":
    case "assigned":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-700">
          In Progress
        </Badge>
      );
    case "completed":
      return <Badge variant="active">Completed</Badge>;
    case "cancelled":
      return <Badge variant="draft">Cancelled</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}

/** Format ISO date string → { date: "Jul 20, 2025", time: "08:24 AM" } */
function splitDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "—", time: "—" };
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

/** Build the standardised export row shape */
function toExportRow(r: Booking) {
  const { date, time } = splitDateTime(r.createdAt);
  return {
    "Booking ID":          formatBookingId(r.id),
    "Full Name":           r.customerName,
    "Phone Number":        r.phone,
    "Address":             r.address ?? "",
    "Service Type":        r.serviceType ?? "",
    "Additional Details":  r.message ?? "",
    "Booking Date":        date,
    "Booking Time":        time,
    "Booking Status":      statusLabel(r.status),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceRequests() {
  const qc      = useQueryClient();
  const { notify } = useToast();

  // ── Filter state ──
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFrom,      setDateFrom]      = useState("");
  const [dateTo,        setDateTo]        = useState("");
  const [sortField,     setSortField]     = useState<"date" | "name" | "status">("date");
  const [sortDir,       setSortDir]       = useState<"asc" | "desc">("desc");

  // ── UI state ──
  const [page,        setPage]        = useState(1);
  const [viewItem,    setViewItem]    = useState<Booking | null>(null);
  const [exporting,   setExporting]   = useState(false);
  const pageSize = 10;

  // ── Data ──
  const { data: allItems = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ["admin-service-requests"],
    queryFn:  () => BookingService.getAll(),
  });

  // ── Derived: filter + sort ──
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    return allItems
      .filter((r) => {
        // Text search: name, phone, address, booking ID
        if (q) {
          const haystack = [
            r.customerName,
            r.phone,
            r.address ?? "",
            formatBookingId(r.id),
          ].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        // Status filter
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        // Service type filter
        if (serviceFilter !== "all" && r.serviceType !== serviceFilter) return false;
        // Date range
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (new Date(r.createdAt) < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (new Date(r.createdAt) > to) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "date")   cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortField === "name")   cmp = a.customerName.localeCompare(b.customerName);
        if (sortField === "status") cmp = a.status.localeCompare(b.status);
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [allItems, search, statusFilter, serviceFilter, dateFrom, dateTo, sortField, sortDir]);

  const pageCount    = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems   = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const hasActiveFilters =
    statusFilter !== "all" || serviceFilter !== "all" || dateFrom || dateTo;

  const clearFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  };

  // ── Mutations ──
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      BookingService.update(id, { status: status as Booking["status"] }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-service-requests"] });
      if (viewItem && viewItem.id === vars.id) {
        setViewItem({ ...viewItem, status: vars.status as Booking["status"] });
      }
      notify({ title: "Status updated", description: `Moved to ${statusLabel(vars.status)}.`, variant: "success" });
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => BookingService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-service-requests"] });
      setViewItem(null);
      notify({ title: "Deleted", description: "Booking has been removed.", variant: "success" });
    },
  });

  // ── Export ──
  function buildExportData() {
    // Export the currently filtered set (or all if no filter)
    const source = filteredItems.length > 0 ? filteredItems : allItems;
    return source.map(toExportRow);
  }

  function handleExport(fmt: "CSV" | "Excel" | "ODS") {
    setExporting(true);
    try {
      const rows = buildExportData();
      const name = `Service_Bookings_Export_${new Date().toISOString().slice(0, 10)}`;
      if (fmt === "CSV")   exportToCSV(rows, name);
      if (fmt === "Excel") exportToExcel(rows, name);
      if (fmt === "ODS")   exportToODS(rows, name);
      notify({ title: "Export Successful", description: `Downloaded as ${fmt}.`, variant: "success" });
    } catch (e: any) {
      const msg = e?.message ?? "Could not generate file.";
      if (msg.includes("No data")) {
        notify({ title: "Nothing to Export", description: "No bookings to download.", variant: "error" });
      } else {
        notify({ title: "Export Failed", description: msg, variant: "error" });
      }
    } finally {
      setExporting(false);
    }
  }

  // ── Sort toggle helper ──
  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  if (error) return <div className="p-8 text-danger-600">Failed to load service requests.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Service Requests</h1>
          <p className="text-sm text-gray-500">
            Manage and track all customer service bookings.
          </p>
        </div>

        {/* Export toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative group inline-block">
            <Button variant="secondary" disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              Export
              <ChevronDown className="h-3.5 w-3.5 ml-2 opacity-60" />
            </Button>
            <div className="absolute right-0 mt-2 w-52 rounded-lg shadow-xl bg-white ring-1 ring-black/5 hidden group-hover:block z-50">
              <div className="py-1.5">
                <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Download As
                </p>
                <button
                  onClick={() => handleExport("CSV")}
                  disabled={exporting}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2"
                >
                  <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                  CSV (.csv)
                </button>
                <button
                  onClick={() => handleExport("Excel")}
                  disabled={exporting}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-500 shrink-0" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport("ODS")}
                  disabled={exporting}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 gap-2"
                >
                  <FileIcon className="h-4 w-4 text-orange-400 shrink-0" />
                  ODS (.ods)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Input
              placeholder="Search name, phone, address, ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full"
            />
          </div>

          {/* Service Type */}
          <select
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none text-gray-700"
            value={serviceFilter}
            onChange={(e) => { setServiceFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Service Types</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status */}
          <select
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none text-gray-700"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none text-gray-700"
            value={`${sortField}-${sortDir}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split("-") as [typeof sortField, typeof sortDir];
              setSortField(field);
              setSortDir(dir);
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="status-asc">Status A–Z</option>
          </select>
        </div>

        {/* Date range row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap">To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-danger-600 transition-colors ml-auto"
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400 font-medium">
            {filteredItems.length} booking{filteredItems.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <DataTable
        pagination={{
          currentPage: page,
          totalPages:  pageCount,
          onPageChange: setPage,
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Booking ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead className="w-[130px]">Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead className="w-[140px]">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  onClick={() => toggleSort("date")}
                >
                  Date &amp; Time
                  {sortField === "date" && (
                    <span className="text-primary-500">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[120px]">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <span className="text-primary-500">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </button>
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <SkeletonText lines={4} className="max-w-md mx-auto" />
                </TableCell>
              </TableRow>
            ) : pagedItems.length > 0 ? (
              pagedItems.map((item) => {
                const { date, time } = splitDateTime(item.createdAt);
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setViewItem(item)}
                  >
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                        {formatBookingId(item.id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{item.customerName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">{item.phone}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-sm text-gray-600 max-w-[160px] truncate block"
                        title={item.address ?? ""}
                      >
                        {item.address || <span className="text-gray-400 italic">Not provided</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-sm text-gray-700 max-w-[140px] truncate block"
                        title={item.serviceType ?? ""}
                      >
                        {item.serviceType || <span className="text-gray-400 italic">—</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 whitespace-nowrap">{date}</div>
                      <div className="text-xs text-gray-400">{time}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewItem(item)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => {
                            if (confirm(`Delete booking ${formatBookingId(item.id)}? This cannot be undone.`)) {
                              deleteItem.mutate(item.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-danger-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48">
                  <EmptyState
                    title="No service requests found"
                    description={
                      hasActiveFilters || search
                        ? "Try adjusting your search or filters."
                        : "No bookings have been submitted yet."
                    }
                    actionLabel={hasActiveFilters || search ? "Clear Filters" : undefined}
                    onAction={hasActiveFilters || search ? clearFilters : undefined}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* ── Detail Drawer ───────────────────────────────────── */}
      <Drawer
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem ? `Booking ${formatBookingId(viewItem.id)}` : ""}
        size="md"
        footer={
          viewItem ? (
            <div className="w-full flex justify-between items-center">
              <Button
                variant="secondary"
                className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 border-transparent shadow-none"
                onClick={() => {
                  if (confirm(`Delete ${formatBookingId(viewItem.id)}?`)) {
                    deleteItem.mutate(viewItem.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button variant="secondary" onClick={() => setViewItem(null)}>
                Close
              </Button>
            </div>
          ) : null
        }
      >
        {viewItem && (
          <div className="space-y-6">

            {/* Status updater */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Update Status
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_UPDATE_OPTIONS.map((opt) => {
                  const isActive = viewItem.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateStatus.mutate({ id: viewItem.id, status: opt.value })
                      }
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        isActive
                          ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking meta */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Booking Details
              </label>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {/* Booking ID */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Booking ID</span>
                  <span className="font-mono text-sm font-semibold text-primary-600">
                    {formatBookingId(viewItem.id)}
                  </span>
                </div>
                {/* Date */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {splitDateTime(viewItem.createdAt).date}
                  </span>
                </div>
                {/* Time */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-900">
                    {splitDateTime(viewItem.createdAt).time}
                  </span>
                </div>
                {/* Status */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={viewItem.status} />
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer Information
              </label>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Full Name</span>
                  <span className="text-sm font-medium text-gray-900">{viewItem.customerName}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </span>
                  <a
                    href={`tel:${viewItem.phone}`}
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    {viewItem.phone}
                  </a>
                </div>
                <div className="px-4 py-3 flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500 flex items-center gap-2 mt-0.5 shrink-0">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    {viewItem.address || <span className="text-gray-400 italic">Not provided</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Service info */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Service Information
              </label>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Wrench className="h-3.5 w-3.5" /> Service Type
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {viewItem.serviceType || <span className="text-gray-400 italic">Not specified</span>}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                    <StickyNote className="h-3.5 w-3.5" />
                    Additional Details
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-3">
                    {viewItem.message || (
                      <span className="text-gray-400 italic">No additional details provided.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
}
