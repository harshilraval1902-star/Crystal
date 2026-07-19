import React, { useState } from "react";
import { Plus, Trash2, Star, CheckCircle, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewService, type Review } from "@/services/review.service";
import { ProductService } from "@/services/product.service";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function Reviews() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [productId, setProductId] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState<Review["status"]>("approved");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: () => ProductService.getAll(),
  });

  const { data: allReviews = [], isLoading, error } = useQuery<Review[]>({
    queryKey: ["admin-reviews"],
    queryFn: () => ReviewService.getAll(),
  });

  const filteredItems = allReviews.filter(item => 
    !search || item.customerName.toLowerCase().includes(search.toLowerCase()) || 
    item.reviewText.toLowerCase().includes(search.toLowerCase())
  );
  
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setProductId("");
    setCustomerName("");
    setRating(5);
    setReviewText("");
    setStatus("approved");
  };

  const createReview = useMutation({
    mutationFn: () => ReviewService.create({
      productId: Number(productId),
      customerName,
      rating,
      reviewText,
      status,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      notify({ title: "Success", description: "Review added successfully.", variant: "success" });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const setReviewStatus = useMutation({
    mutationFn: ({ id, s }: { id: number; s: Review["status"] }) => ReviewService.update(id, { status: s }),
    onSuccess: (_, { s }) => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      notify({ title: "Status updated", description: `Review marked as ${s}.`, variant: "success" });
    },
  });

  const deleteReview = useMutation({
    mutationFn: (id: number) => ReviewService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      notify({ title: "Deleted", description: "The review has been removed.", variant: "success" });
    },
  });

  const productName = (id: number) => products.find((p) => p.id === id)?.name ?? `Product #${id}`;

  if (error) return <div className="p-8 text-danger-600">Failed to load reviews.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Reviews</h1>
          <p className="text-sm text-gray-500">Moderate and approve customer feedback on your products.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsDrawerOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Review
        </Button>
      </div>

      <DataTable 
        searchPlaceholder="Search reviews by customer name or content..."
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
              <TableHead className="w-[200px]">Product</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="w-[120px]">Rating</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right w-[180px]">Actions</TableHead>
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
                    <div className="font-medium text-gray-900 text-sm truncate" title={productName(item.productId)}>
                      {productName(item.productId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary-600 font-bold text-xs">
                        {item.customerName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{item.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 line-clamp-2" title={item.reviewText}>
                      {item.reviewText}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-accent-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{item.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'approved' ? 'active' : item.status === 'rejected' ? 'urgent' : 'pending'}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {item.status !== "approved" && (
                        <Button variant="ghost" size="icon" onClick={() => setReviewStatus.mutate({ id: item.id, s: "approved" })} title="Approve">
                          <CheckCircle className="h-4 w-4 text-accent-600" />
                        </Button>
                      )}
                      {item.status !== "rejected" && (
                        <Button variant="ghost" size="icon" onClick={() => setReviewStatus.mutate({ id: item.id, s: "rejected" })} title="Reject">
                          <XCircle className="h-4 w-4 text-warning-500" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Delete this review?')) {
                          deleteReview.mutate(item.id);
                        }
                      }}>
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48">
                  <EmptyState 
                    title="No reviews found" 
                    description="There are no product reviews matching your criteria."
                    actionLabel="Add Review"
                    onAction={() => { resetForm(); setIsDrawerOpen(true); }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>

      {/* Editor Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Review"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => createReview.mutate()}
              disabled={createReview.isPending}
            >
              {createReview.isPending ? "Saving..." : "Add Review"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Product *</label>
            <select 
              value={productId} 
              onChange={(e) => setProductId(Number(e.target.value))}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
            >
              <option value="">Select a product...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name *</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Rating (1-5) *</label>
              <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as Review["status"])}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Review Text *</label>
            <textarea 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[120px]"
              placeholder="Enter the customer's review..."
            />
          </div>

        </div>
      </Drawer>
    </div>
  );
}
