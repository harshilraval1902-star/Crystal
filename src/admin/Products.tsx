import { useMemo, useState } from "react";
import { Plus, Settings2, MoreHorizontal, Pencil, Trash2, Copy, SearchX, ShoppingBag, Check } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ProductService, type Product } from "@/services/product.service";
import { DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/admin/ui/DataTable";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { SkeletonText } from "@/components/admin/ui/Skeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { useToast } from "@/components/admin/ToastProvider";

const CATEGORIES = ["All", "RO Purifier", "UV Purifier", "UF Purifier", "Gravity Filter", "Commercial RO", "Accessories"];
const STATUSES = ["All", "Active", "Inactive"];

export default function Products() {
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  const { notify } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: allProducts = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: () => ProductService.getAll(),
  });

  const toggleActive = useMutation({
    mutationFn: async (p: Product) => ProductService.update(p.id, { isActive: !p.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      notify({ title: "Visibility updated", description: "Product status changed successfully.", variant: "success" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => ProductService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      notify({ title: "Product deleted", description: "The product was removed.", variant: "error" });
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== deleteProduct.variables));
    },
  });

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchStatus = statusFilter === "All" || 
        (statusFilter === "Active" ? p.isActive : !p.isActive);
      return matchSearch && matchCategory && matchStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allProducts, search, categoryFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      selectedIds.forEach(id => deleteProduct.mutate(id));
      setSelectedIds([]);
    }
  };

  if (error) {
    return <div className="p-8 text-danger-600">Failed to load products.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog, pricing, and inventory.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/admin/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable 
        searchPlaceholder="Search products by name or SKU..."
        onSearch={setSearch}
        selectedCount={selectedIds.length}
        bulkActions={
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        }
        pagination={{
          currentPage: page,
          totalPages: pageCount,
          onPageChange: setPage
        }}
        actions={
          <>
            <select 
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </TableHead>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <SkeletonText lines={3} className="max-w-md mx-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <TableRow key={product.id} data-state={selectedIds.includes(product.id) ? "selected" : undefined}>
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        {(product.mainImageUrl || product.thumbnail || product.image) ? (
                          <img 
                            src={product.mainImageUrl || product.thumbnail || product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{product.name}</div>
                        {product.brand && <div className="text-xs text-gray-500 truncate">{product.brand}</div>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{product.category}</TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900">₹{product.price}</span>
                    {product.discountPrice && (
                      <span className="ml-2 text-xs text-gray-400 line-through">₹{product.discountPrice}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.stockStatus === 'in_stock' ? (
                      <Badge variant="active">In Stock</Badge>
                    ) : product.stockStatus === 'out_of_stock' ? (
                      <Badge variant="urgent">Out of Stock</Badge>
                    ) : (
                      <Badge variant="pending">Limited</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive.mutate(product)} className="hover:opacity-80 transition-opacity">
                      <Badge variant={product.isActive ? 'active' : 'draft'}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          deleteProduct.mutate(product.id);
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
                <TableCell colSpan={7} className="h-48">
                  <EmptyState 
                    icon={SearchX}
                    title="No products found" 
                    description={search ? `No results for "${search}"` : "We couldn't find any products matching your current filters."}
                    actionLabel="Clear Filters"
                    onAction={() => { setSearch(""); setCategoryFilter("All"); setStatusFilter("All"); }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
