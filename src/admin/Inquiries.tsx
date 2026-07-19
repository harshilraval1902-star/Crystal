import React, { useState } from "react";
import { Search, Eye, Filter, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InquiryService, type Inquiry } from "@/services/inquiry.service";
import { Button } from "@/components/admin/ui/Button";
import { Drawer } from "@/components/admin/ui/Drawer";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";

export default function Inquiries() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  const { data: allInquiries = [], isLoading, error } = useQuery<Inquiry[]>({
    queryKey: ["admin-inquiries"],
    queryFn: () => InquiryService.getAll(),
  });

  const filteredItems = allInquiries.filter(inq => 
    !search || `${inq.name} ${inq.phone} ${inq.email || ""} ${inq.subject || ""}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const deleteInquiry = useMutation({
    mutationFn: (id: number) => InquiryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
      notify({ title: "Deleted", description: "The inquiry has been removed.", variant: "success" });
      setViewInquiry(null);
    },
  });

  if (error) return <div className="p-8 text-danger-600">Failed to load inquiries.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inbound Inquiries</h1>
          <p className="text-sm text-gray-500">Read and manage messages from your website contact form.</p>
        </div>
      </div>

      <DataTable 
        searchPlaceholder="Search by customer name, email, phone, or subject..."
        onSearch={setSearch}
        pagination={{
          currentPage: page,
          totalPages: pageCount,
          onPageChange: setPage
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <SkeletonText lines={3} className="max-w-md mx-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map(item => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50/50" onClick={() => setViewInquiry(item)}>
                  <TableCell>
                    <span className="font-mono text-sm text-gray-500">#{item.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 truncate max-w-[180px]">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[180px]">{item.email || item.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-md">{item.subject || "No subject"}</div>
                    <div className="text-xs text-gray-500 truncate max-w-md mt-0.5">{item.message}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setViewInquiry(item); }} title="Read">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this inquiry?')) deleteInquiry.mutate(item.id);
                      }} title="Delete">
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48">
                  <EmptyState 
                    title="No inquiries found" 
                    description={search ? "Try adjusting your search criteria." : "You have no unread messages."}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!viewInquiry}
        onClose={() => setViewInquiry(null)}
        title={`Inquiry #${viewInquiry?.id}`}
        size="md"
        footer={
          <div className="w-full flex justify-between items-center">
            <Button variant="secondary" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 border-transparent shadow-none" onClick={() => {
              if (confirm('Delete this inquiry?')) deleteInquiry.mutate(viewInquiry!.id);
            }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Message
            </Button>
            <Button variant="secondary" onClick={() => setViewInquiry(null)}>Close</Button>
          </div>
        }
      >
        {viewInquiry && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{viewInquiry.subject || "No subject provided"}</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{viewInquiry.message || "No message content."}</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Information</label>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 font-medium">N</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">{viewInquiry.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{viewInquiry.phone}</p>
                    </div>
                  </div>
                  <a href={`tel:${viewInquiry.phone}`} className="text-xs font-semibold text-primary-600 hover:text-primary-700">Call</a>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{viewInquiry.email || "Not provided"}</p>
                    </div>
                  </div>
                  {viewInquiry.email && (
                    <a href={`mailto:${viewInquiry.email}`} className="text-xs font-semibold text-primary-600 hover:text-primary-700">Reply</a>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Received on {new Date(viewInquiry.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
