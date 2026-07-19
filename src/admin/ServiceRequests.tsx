import React, { useState } from "react";
import { Search, Eye, Filter, CheckCircle, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ServiceService, type ServiceRequest } from "@/services/service.service";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function ServiceRequests() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [viewRequest, setViewRequest] = useState<ServiceRequest | null>(null);

  const { data: allRequests = [], isLoading, error } = useQuery<ServiceRequest[]>({
    queryKey: ["admin-service-requests"],
    queryFn: () => ServiceService.getAll(),
  });

  const filteredItems = allRequests.filter(req => 
    (!search || `${req.customerName} ${req.phone} ${req.email || ""}`.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || req.status === statusFilter)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const updateStatus = useMutation({
    mutationFn: ({ id, status: newStatus }: { id: number; status: ServiceRequest["status"] }) => ServiceService.update(id, { status: newStatus }),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["admin-service-requests"] });
      notify({ title: "Status updated", description: `Request moved to ${status}.`, variant: "success" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="urgent">New</Badge>;
      case 'contacted': return <Badge variant="pending">Contacted</Badge>;
      case 'in_progress': return <Badge variant="default" className="bg-blue-100 text-blue-700">In Progress</Badge>;
      case 'completed': return <Badge variant="active">Completed</Badge>;
      case 'cancelled': return <Badge variant="draft">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (error) return <div className="p-8 text-danger-600">Failed to load requests.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Service Requests</h1>
          <p className="text-sm text-gray-500">Manage and track customer service bookings.</p>
        </div>
      </div>

      <DataTable 
        searchPlaceholder="Search by customer name, email, or phone..."
        onSearch={setSearch}
        pagination={{
          currentPage: page,
          totalPages: pageCount,
          onPageChange: setPage
        }}
        actions={
          <>
            <select 
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <Button variant="secondary" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <SkeletonText lines={3} className="max-w-md mx-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-mono text-sm text-gray-500">#{item.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">{item.customerName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{item.phone}</div>
                    <div className="text-xs text-gray-500">{item.email || "No email provided"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewRequest(item)} title="View Details">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48">
                  <EmptyState 
                    title="No service requests found" 
                    description={search || statusFilter !== 'all' ? "Try adjusting your filters." : "You have no service requests at the moment."}
                    actionLabel="Clear Filters"
                    onAction={() => { setSearch(""); setStatusFilter("all"); }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        title={`Service Request #${viewRequest?.id}`}
        size="md"
        footer={
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Current Status: <strong className="text-gray-900">{viewRequest?.status.replace('_', ' ').toUpperCase()}</strong>
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setViewRequest(null)}>Close</Button>
            </div>
          </div>
        }
      >
        {viewRequest && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.filter(o => o.value !== 'all').map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updateStatus.mutate({ id: viewRequest.id, status: opt.value as ServiceRequest["status"] });
                      setViewRequest({ ...viewRequest, status: opt.value as ServiceRequest["status"] });
                    }}
                    className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                      viewRequest.status === opt.value 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {viewRequest.status === opt.value && <CheckCircle className="h-4 w-4 mr-2" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Details</label>
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium text-gray-900">{viewRequest.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm font-medium text-gray-900">{viewRequest.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-900">{viewRequest.email || "Not provided"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Information</label>
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Submitted</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(viewRequest.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
