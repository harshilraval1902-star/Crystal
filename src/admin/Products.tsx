import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService, type Product } from "@/services/product.service";
import PageHeader from "@/components/admin/PageHeader";
import SectionCard from "@/components/admin/SectionCard";
import DataTable from "@/components/admin/DataTable";
import SearchBar from "@/components/admin/SearchBar";
import FilterTabs from "@/components/admin/FilterTabs";
import PaginationControls from "@/components/admin/PaginationControls";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/ToastProvider";
import { useAdminSearch } from "@/components/admin/AdminSearchContext";

const CATEGORIES = ["RO Purifier", "UV Purifier", "UF Purifier", "Gravity Filter", "Commercial RO", "Accessories"];
const CATEGORY_FILTERS = ["all", ...CATEGORIES];
const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "limited", label: "Limited Stock" },
];
const SORT_OPTIONS = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
  { value: "price_asc", label: "Price low → high" },
  { value: "price_desc", label: "Price high → low" },
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function Products() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  // List filters
  const { search, setSearch } = useAdminSearch();
  const [showActive, setShowActive] = useState("all");

  // Form state — shared between Create and Edit
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [warranty, setWarranty] = useState("");
  const [stockStatus, setStockStatus] = useState("in_stock");
  const [stock, setStock] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState("");
  const [badge, setBadge] = useState("");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const { notify } = useToast();

  const queryKey = ["admin-products", search, showActive, categoryFilter, sortBy] as const;
  const { data = [], isLoading, error } = useQuery<Product[]>({
    queryKey,
    queryFn: async () => {
      const all = await ProductService.getAll();
      const filtered = all.filter((p) => {
        const normalized = `${p.name} ${p.slug} ${p.brand ?? ""} ${p.model ?? ""} ${p.category ?? ""} ${p.tags?.join(" ") ?? ""}`.toLowerCase();
        return (
          (!search || normalized.includes(search.toLowerCase())) &&
          (showActive === "all" || p.isActive === (showActive === "active")) &&
          (categoryFilter === "all" || (p.category ?? "") === categoryFilter)
        );
      });

      return filtered.sort((a, b) => {
        switch (sortBy) {
          case "price_asc":
            return Number(a.price) - Number(b.price);
          case "price_desc":
            return Number(b.price) - Number(a.price);
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "created_asc":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    },
  });

  const filteredProducts = useMemo(() => data, [data]);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, showActive, categoryFilter, sortBy, pageSize]);

  const resetForm = () => {
    setEditId(null); setName(""); setSlug(""); setBrand(""); setModel(""); setCategory("RO Purifier");
    setPrice(""); setDiscountPrice(""); setDescription(""); setFeatures(""); setSpecifications("");
    setWarranty(""); setStockStatus("in_stock"); setStock(""); setThumbnail(""); setImages(""); setBadge(""); setTags(""); setSeoTitle(""); setSeoDescription("");
    setImageUrl(""); setImagePreview(""); setIsActive(true); setFeatured(false); setValidationErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const populateForm = (p: Product) => {
    setEditId(p.id); setName(p.name); setSlug(p.slug); setBrand(p.brand ?? ""); setModel(p.model ?? "");
    setCategory(p.category ?? "RO Purifier"); setPrice(p.price); setDiscountPrice(p.discountPrice ?? "");
    setDescription(p.description ?? ""); setFeatures((p.features ?? []).join("\n")); setSpecifications(p.specifications ?? "");
    setWarranty(p.warranty ?? ""); setStockStatus(p.stockStatus ?? "in_stock"); setStock(p.stock?.toString() ?? ""); setThumbnail(p.thumbnail ?? "");
    setImages((p.images ?? p.variants ?? []).join("\n")); setBadge(p.badge ?? "");
    setTags((p.tags ?? []).join(", ")); setSeoTitle(p.seoTitle ?? ""); setSeoDescription(p.seoDescription ?? "");
    const img = p.mainImageUrl ?? p.image ?? "";
    setImageUrl(img); setImagePreview(img); setIsActive(p.isActive); setFeatured(p.featured ?? false); setValidationErrors({});
    window.scrollTo({ top: document.getElementById("product-form")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const buildPayload = () => {
    const normalizedSlug = slug.trim() || slugify(name);
    const parsedStock = stock ? Math.max(0, Number(stock)) : undefined;
    const imageList = images
      ? images.split("\n").map((item) => item.trim()).filter(Boolean)
      : undefined;

    return {
      name,
      slug: normalizedSlug,
      brand: brand || undefined,
      model: model || undefined,
      category,
      price,
      discountPrice: discountPrice || undefined,
      description: description || undefined,
      features: features ? features.split("\n").map((f) => f.trim()).filter(Boolean) : undefined,
      specifications: specifications || undefined,
      warranty: warranty || undefined,
      stockStatus,
      stock: parsedStock,
      thumbnail: thumbnail || undefined,
      badge: badge || undefined,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      mainImageUrl: imagePreview || imageUrl || undefined,
      image: imagePreview || imageUrl || undefined,
      images: imageList ?? (imagePreview || imageUrl ? [imagePreview || imageUrl] : undefined),
      isActive,
      featured,
      displayOrder: 0,
    };
  };

  const saveProduct = useMutation({
    mutationFn: () =>
      editId !== null
        ? ProductService.update(editId, buildPayload())
        : ProductService.create(buildPayload()),
    onSuccess: () => {
      resetForm();
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      notify({ title: editId ? "Product updated" : "Product created", description: "Your changes have been saved.", variant: "success" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => ProductService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      setDeleteProductId(null);
      notify({ title: "Product deleted", description: "The product was removed successfully.", variant: "danger" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async (p: Product) => ProductService.update(p.id, { isActive: !p.isActive }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      notify({ title: "Product visibility updated", description: "The product status has been saved.", variant: "success" });
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Enter the product name.";
    if (!slug.trim()) errors.slug = "Enter or generate a product slug.";
    if (!price.trim() || Number.isNaN(Number(price))) errors.price = "Enter a valid price.";
    if (discountPrice && Number.isNaN(Number(discountPrice))) errors.discountPrice = "Enter a valid original price.";
    if (discountPrice && Number(price) && Number(discountPrice) < Number(price)) errors.discountPrice = "Original price should be greater than or equal to selling price.";
    if (stock && (Number.isNaN(Number(stock)) || Number(stock) < 0)) errors.stock = "Stock must be a positive number.";
    return errors;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target?.result as string); setImageUrl(""); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);
    if (Object.keys(errors).length) return;
    saveProduct.mutate();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage product catalog listings, pricing details, and inventory status in one place."
        breadcrumbs={[{ label: "Catalog", href: "/admin/products" }, { label: "Products" }]}
        actions={
          <button type="button" onClick={() => window.scrollTo({ top: document.getElementById("product-form")?.offsetTop ?? 0, behavior: "smooth" })}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add product
          </button>
        }
      />

      <SectionCard
        title="Product management"
        description="Use filters, search, and bulk actions to keep your catalog organized."
        actions={
          <FilterTabs
            options={CATEGORY_FILTERS.map((label) => ({ label, value: label }))}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products, categories, brands..." />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={showActive}
              onChange={(e) => setShowActive(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <SectionCard
          title="Product catalog"
          description="View and manage all products with inventory actions, status toggles, and bulk controls."
        >
          {error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load products.</div>
          ) : (
            <>
              <DataTable>
                <table className="w-full min-w-[680px] divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Product</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Price</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Status</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Featured</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Created</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {(product.mainImageUrl ?? product.image) && (
                              <img src={product.mainImageUrl ?? product.image} alt={product.name}
                                className="h-10 w-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-500">{product.brand ?? ""}{product.category ? ` · ${product.category}` : ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-slate-700">₹{product.price}</div>
                          {product.discountPrice && <div className="text-xs text-slate-400 line-through">₹{product.discountPrice}</div>}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={product.isActive ? "Active" : "Inactive"} />
                        </td>
                        <td className="px-4 py-4">
                          {product.featured ? <StatusBadge status="Featured" /> : <span className="text-slate-400 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-xs">{new Date(product.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4 space-x-2">
                          <button type="button" onClick={() => populateForm(product)}
                            className="rounded-2xl bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200">
                            Edit
                          </button>
                          <button type="button" onClick={() => toggleActive.mutate(product)}
                            className="rounded-2xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                            {product.isActive ? "Disable" : "Enable"}
                          </button>
                          <button type="button" onClick={() => deleteProduct.mutate(product.id)}
                            className="rounded-2xl bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-200">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {paginatedProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </DataTable>
              <PaginationControls
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={filteredProducts.length}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </SectionCard>

        {/* Form */}
        <SectionCard
          id="product-form"
          title={editId ? "Edit product" : "Add new product"}
          description="Use this form to add new catalog items or update existing product details."
          className="scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Catalog editor</p>
              <h2 className="text-xl font-semibold text-slate-950">{editId ? "Edit product" : "Add new product"}</h2>
            </div>
            {editId && (
              <button type="button" onClick={resetForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                ✕ Cancel edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Name *</label>
              <input required value={name} onChange={(e) => { setName(e.target.value); if (!editId) setSlug(slugify(e.target.value)); }}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Brand</label>
                <input value={brand} onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Model</label>
                <input value={model} onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Price (₹) *</label>
                <input required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9499"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">MRP / Original (₹)</label>
                <input value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="12000"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Features (one per line)</label>
              <textarea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)}
                placeholder={"6-Stage RO+UV+UF\n15L Storage Tank\n1 Year Warranty"}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Specifications</label>
              <textarea rows={2} value={specifications} onChange={(e) => setSpecifications(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Warranty</label>
                <input value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="2 Year Warranty"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Stock Status</label>
                <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                  {STOCK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Stock</label>
                <input value={stock} onChange={(e) => setStock(e.target.value)} placeholder="20"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
                {validationErrors.stock && <p className="mt-1 text-xs text-rose-600">{validationErrors.stock}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-900">Badge</label>
                <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Best Seller"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Thumbnail URL</label>
              <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://…"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Additional image URLs (one per line)</label>
              <textarea rows={3} value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://...\nhttps://..."
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">Product Image</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400" />
              <p className="mt-1.5 text-xs text-slate-400">Or paste an image URL below</p>
              <input value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(""); }} placeholder="https://…"
                className="mt-1.5 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
              {(imagePreview || imageUrl) && (
                <img src={imagePreview || imageUrl} alt="preview" className="mt-3 h-24 w-24 rounded-2xl object-contain bg-slate-100 border border-slate-200" />
              )}
            </div>
            {/* SEO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">SEO Title</label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">SEO Description</label>
              <textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 resize-none" />
            </div>
            {/* Toggles */}
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                Featured on Home
              </label>
            </div>
            {Object.keys(validationErrors).length > 0 && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Please fix the highlighted fields before saving.
              </div>
            )}
            <button type="submit" disabled={saveProduct.isPending}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {saveProduct.isPending ? "Saving…" : editId ? "Update product" : "Create product"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
