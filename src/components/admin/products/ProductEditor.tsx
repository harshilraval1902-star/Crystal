import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, FileText, Image as ImageIcon, CheckCircle2, Globe, AlertCircle } from "lucide-react";
import { ProductService, type Product } from "@/services/product.service";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { BlockCard } from "../ui/Card";
import { ImageDragDrop } from "./ImageDragDrop";
import { useToast } from "../ToastProvider";
import { RichTextEditor } from "../ui/RichTextEditor";

const CATEGORIES = ["RO Purifier", "UV Purifier", "UF Purifier", "Gravity Filter", "Commercial RO", "Accessories"];

interface ProductEditorProps {
  productId?: number;
}

export function ProductEditor({ productId }: ProductEditorProps) {
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { notify } = useToast();
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    brand: "",
    model: "",
    category: CATEGORIES[0],
    price: "",
    discountPrice: "",
    description: "",
    stockStatus: "in_stock",
    stock: "",
    isActive: true,
    featured: false,
    images: [] as string[]
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const { data: existingProduct, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductService.getAll().then(all => all.find(p => p.id === productId)),
    enabled: isEditMode
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        slug: existingProduct.slug || "",
        seoTitle: existingProduct.name || "",
        seoDescription: "",
        brand: existingProduct.brand || "",
        model: existingProduct.model || "",
        category: existingProduct.category || CATEGORIES[0],
        price: existingProduct.price?.toString() || "",
        discountPrice: existingProduct.discountPrice?.toString() || "",
        description: existingProduct.description || "",
        stockStatus: existingProduct.stockStatus || "in_stock",
        stock: existingProduct.stock?.toString() || "",
        isActive: existingProduct.isActive ?? true,
        featured: existingProduct.featured ?? false,
        images: existingProduct.images || (existingProduct.mainImageUrl ? [existingProduct.mainImageUrl] : [])
      });
    }
  }, [existingProduct]);

  // Handle auto slug generation
  useEffect(() => {
    if (!isEditMode && formData.name && !isDirty) {
      setFormData(prev => ({ 
        ...prev, 
        slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        seoTitle: prev.name
      }));
    }
  }, [formData.name, isEditMode, isDirty]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Validate
      if (!formData.name) throw new Error("Name is required");
      if (!formData.price) throw new Error("Price is required");

      const payload: any = {
        ...formData,
        price: formData.price,
        mainImageUrl: formData.images[0] || null,
        stock: formData.stock ? parseInt(formData.stock, 10) : null
      };

      if (isEditMode) {
        return ProductService.update(productId, payload);
      } else {
        return ProductService.create(payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      notify({ title: "Success", description: "Product saved successfully", variant: "success" });
      navigate("/admin/products");
    },
    onError: (e: any) => {
      notify({ title: "Error", description: e.message || "Failed to save product", variant: "error" });
    }
  });

  const handleAddImageUrl = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl] }));
      setNewImageUrl("");
      setIsDirty(true);
    }
  };

  if (isEditMode && isLoading) return <div className="p-8"><div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div></div></div></div></div>;

  return (
    <div className="mx-auto max-w-5xl pb-20 animate-in fade-in duration-500">
      
      {/* Sticky Save Bar */}
      <div className="sticky top-[64px] z-20 -mx-4 mb-8 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline">Catalog /</span>
              <span className="text-gray-900 font-medium">{isEditMode ? 'Edit Product' : 'New Product'}</span>
            </div>
            {isDirty && <span className="text-[10px] sm:text-xs text-orange-500 font-medium flex items-center mt-0.5"><AlertCircle className="h-3 w-3 mr-1" /> Unsaved changes</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:flex items-center text-xs text-gray-500 mr-2">
            <CheckCircle2 className="h-4 w-4 mr-1 text-accent-500" />
            Autosaved
          </span>
          <Button variant="secondary" onClick={() => navigate("/admin/products")} className="hidden sm:flex">Cancel</Button>
          <Button variant="primary" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <BlockCard>
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Product Name *</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Crystal Pro RO Water Purifier" 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <RichTextEditor 
                  value={formData.description}
                  onChange={(val) => handleChange('description', val)}
                />
              </div>
            </div>
          </BlockCard>

          {/* Media & Images */}
          <BlockCard>
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-secondary-50 p-2 text-secondary-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Media Gallery</h3>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Paste image URL here..." 
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
              />
              <Button type="button" variant="secondary" onClick={handleAddImageUrl}>Add</Button>
            </div>
            
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6">
              {formData.images.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-8">
                  No images added yet. Add URLs above to build the gallery.
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Drag and drop to reorder. First image is the cover.</p>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">{formData.images.length} images</span>
                  </div>
                  <ImageDragDrop 
                    images={formData.images} 
                    onChange={(images) => handleChange('images', images)} 
                  />
                </>
              )}
            </div>
          </BlockCard>

          {/* Pricing & Inventory */}
          <BlockCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Inventory</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Selling Price (₹) *</label>
                <Input 
                  type="number"
                  value={formData.price} 
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Original MRP (₹)</label>
                <Input 
                  type="number"
                  value={formData.discountPrice} 
                  onChange={(e) => handleChange('discountPrice', e.target.value)}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Stock Status</label>
                <select 
                  value={formData.stockStatus} 
                  onChange={(e) => handleChange('stockStatus', e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Available Quantity</label>
                <Input 
                  type="number"
                  value={formData.stock} 
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="e.g. 50" 
                />
              </div>
            </div>
          </BlockCard>
          
          {/* SEO Options */}
          <BlockCard>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-green-50 p-2 text-green-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Search Engine Optimization</h3>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Live Preview Card */}
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Search Engine Preview</p>
                <div className="text-[#1a0dab] text-lg sm:text-xl hover:underline cursor-pointer truncate font-medium">
                  {formData.seoTitle || formData.name || 'Your Product Title'}
                </div>
                <div className="text-[#006621] text-sm truncate flex items-center mt-1">
                  https://yourwebsite.com/product/{formData.slug || 'product-slug'}
                </div>
                <div className="text-[#545454] text-sm mt-1 line-clamp-2">
                  {formData.seoDescription || 'Add a description to see how this product might appear in search engine results.'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-gray-700">Page Title</label>
                    <span className={`text-xs ${formData.seoTitle.length > 60 ? 'text-danger-500' : 'text-gray-500'}`}>{formData.seoTitle.length}/60</span>
                  </div>
                  <Input value={formData.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <span className={`text-xs ${formData.seoDescription.length > 160 ? 'text-danger-500' : 'text-gray-500'}`}>{formData.seoDescription.length}/160</span>
                  </div>
                  <textarea 
                    value={formData.seoDescription}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">URL Slug</label>
                  <Input value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} />
                </div>
              </div>
            </div>
          </BlockCard>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <BlockCard>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Product Organization</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
                <Input value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Model / SKU</label>
                <Input value={formData.model} onChange={(e) => handleChange('model', e.target.value)} />
              </div>
            </div>
          </BlockCard>

          <BlockCard>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Visibility</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">Active</span>
                  <span className="text-xs text-gray-500">Product is visible on your store.</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 block">Featured</span>
                  <span className="text-xs text-gray-500">Show on homepage collections.</span>
                </div>
              </label>
            </div>
          </BlockCard>
        </div>
      </div>
    </div>
  );
}
