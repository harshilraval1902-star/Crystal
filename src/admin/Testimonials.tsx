import React, { useState } from "react";
import { Plus, Edit2, Trash2, Star, Quote } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TestimonialService, type Testimonial } from "@/services/testimonial.service";
import { Button } from "@/components/admin/ui/Button";
import { BlockCard } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { Drawer } from "@/components/admin/ui/Drawer";
import { Input } from "@/components/admin/ui/Input";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { useToast } from "@/components/admin/ToastProvider";
import { EmptyState } from "@/components/admin/ui/EmptyState";

export default function Testimonials() {
  const qc = useQueryClient();
  const { notify } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState("");
  const [designation, setDesignation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: allTestimonials = [], isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ["admin-testimonials"],
    queryFn: () => TestimonialService.getAll(),
  });

  const filteredItems = allTestimonials.filter(item => 
    !search || item.customerName.toLowerCase().includes(search.toLowerCase()) || 
    item.review.toLowerCase().includes(search.toLowerCase())
  );
  
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const resetForm = () => {
    setEditingItem(null);
    setCustomerName("");
    setReview("");
    setRating(5);
    setLocation("");
    setDesignation("");
    setPhotoUrl("");
    setIsActive(true);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setCustomerName(item.customerName);
    setReview(item.review);
    setRating(item.rating);
    setLocation(item.location || "");
    setDesignation(item.designation || "");
    setPhotoUrl(item.photoUrl || "");
    setIsActive(item.isActive);
    setIsDrawerOpen(true);
  };

  const saveItem = useMutation({
    mutationFn: () => {
      const payload = {
        customerName,
        review,
        rating,
        location: location || undefined,
        designation: designation || undefined,
        photoUrl: photoUrl || undefined,
        isActive,
        displayOrder: editingItem ? editingItem.displayOrder : allTestimonials.length,
      };

      if (editingItem) {
        return TestimonialService.update(editingItem.id, payload);
      }
      return TestimonialService.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      notify({ title: "Success", description: `Testimonial ${editingItem ? 'updated' : 'created'} successfully.`, variant: "success" });
      setIsDrawerOpen(false);
      resetForm();
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => TestimonialService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      notify({ title: "Deleted", description: "The testimonial has been removed.", variant: "success" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: (item: Testimonial) => TestimonialService.update(item.id, { isActive: !item.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  if (error) return <div className="p-8 text-danger-600">Failed to load testimonials.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Testimonials</h1>
          <p className="text-sm text-gray-500">Manage customer reviews and feedback shown on the website.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setIsDrawerOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <DataTable 
        searchPlaceholder="Search testimonials by name or review content..."
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
              <TableHead className="w-[250px]">Customer</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="w-[120px]">Rating</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
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
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.customerName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary-500 font-bold bg-primary-50">
                            {item.customerName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{item.customerName}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {[item.designation, item.location].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-sm text-gray-600 max-w-lg">
                      <Quote className="h-3 w-3 shrink-0 text-gray-300 mt-1" />
                      <span className="line-clamp-2">{item.review}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-accent-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{item.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'active' : 'draft'}>
                      {item.isActive ? 'Published' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleActive.mutate(item)} title={item.isActive ? 'Hide' : 'Publish'}>
                        {item.isActive ? <Star className="h-4 w-4 text-gray-400" /> : <Star className="h-4 w-4 text-accent-500 fill-accent-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Delete this testimonial?')) {
                          deleteItem.mutate(item.id);
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
                <TableCell colSpan={5} className="h-48">
                  <EmptyState 
                    title="No testimonials found" 
                    description="You haven't added any customer testimonials yet."
                    actionLabel="Add Testimonial"
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
        title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => saveItem.mutate()}
              disabled={saveItem.isPending}
            >
              {saveItem.isPending ? "Saving..." : editingItem ? "Update Testimonial" : "Add Testimonial"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Customer Name *</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Rahul Sharma" />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Review *</label>
            <textarea 
              value={review} 
              onChange={(e) => setReview(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[100px]"
              placeholder="What did the customer say?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Rating (1-5) *</label>
              <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Photo URL</label>
              <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>
              <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Homeowner" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Publish this testimonial on the website immediately
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
