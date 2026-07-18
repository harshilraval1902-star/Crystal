import { Request, Response } from "express";
import prisma from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";

// GET /api/products
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  // Parse JSON fields
  const parsed = products.map((p) => ({
    ...p,
    features: p.features ? JSON.parse(p.features) : [],
    images: p.images ? JSON.parse(p.images) : [],
    variants: p.variants ? JSON.parse(p.variants) : [],
    tags: p.tags ? JSON.parse(p.tags) : [],
  }));

  res.json(parsed);
});

// GET /api/products/:id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findFirst({ where: { id, isDeleted: false } });

  if (!product) throw createError("Product not found.", 404);

  res.json({
    ...product,
    features: product.features ? JSON.parse(product.features) : [],
    images: product.images ? JSON.parse(product.images) : [],
    variants: product.variants ? JSON.parse(product.variants) : [],
    tags: product.tags ? JSON.parse(product.tags) : [],
  });
});

// POST /api/products
export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    name: string;
    slug: string;
    price: string;
    brand?: string;
    model?: string;
    category?: string;
    discountPrice?: string;
    description?: string;
    features?: string[];
    specifications?: string;
    warranty?: string;
    stockStatus?: string;
    stock?: number;
    featured?: boolean;
    mainImageUrl?: string;
    thumbnail?: string;
    image?: string;
    images?: string[];
    variants?: string[];
    tags?: string[];
    badge?: string;
    seoTitle?: string;
    seoDescription?: string;
    isActive?: boolean;
    displayOrder?: number;
  };

  if (!data.name || !data.slug || !data.price) {
    throw createError("name, slug, and price are required.", 400);
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) throw createError("A product with this slug already exists.", 409);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      brand: data.brand,
      model: data.model,
      category: data.category,
      discountPrice: data.discountPrice,
      description: data.description,
      features: data.features ? JSON.stringify(data.features) : undefined,
      specifications: data.specifications,
      warranty: data.warranty,
      stockStatus: data.stockStatus ?? "in_stock",
      stock: data.stock,
      featured: data.featured ?? false,
      mainImageUrl: data.mainImageUrl,
      thumbnail: data.thumbnail,
      image: data.image,
      images: data.images ? JSON.stringify(data.images) : undefined,
      variants: data.variants ? JSON.stringify(data.variants) : undefined,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      badge: data.badge,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      isActive: data.isActive ?? true,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  res.status(201).json({
    ...product,
    features: product.features ? JSON.parse(product.features) : [],
    images: product.images ? JSON.parse(product.images) : [],
    variants: product.variants ? JSON.parse(product.variants) : [],
    tags: product.tags ? JSON.parse(product.tags) : [],
  });
});

// PUT /api/products/:id
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Product not found.", 404);

  const data = req.body as Partial<{
    name: string;
    slug: string;
    price: string;
    brand: string;
    model: string;
    category: string;
    discountPrice: string;
    description: string;
    features: string[];
    specifications: string;
    warranty: string;
    stockStatus: string;
    stock: number;
    featured: boolean;
    mainImageUrl: string;
    thumbnail: string;
    image: string;
    images: string[];
    variants: string[];
    tags: string[];
    badge: string;
    seoTitle: string;
    seoDescription: string;
    isActive: boolean;
    displayOrder: number;
  }>;

  // Check slug uniqueness if changing
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.product.findFirst({
      where: { slug: data.slug, id: { not: id }, isDeleted: false },
    });
    if (slugExists) throw createError("A product with this slug already exists.", 409);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.model !== undefined && { model: data.model }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.discountPrice !== undefined && { discountPrice: data.discountPrice }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.features !== undefined && { features: JSON.stringify(data.features) }),
      ...(data.specifications !== undefined && { specifications: data.specifications }),
      ...(data.warranty !== undefined && { warranty: data.warranty }),
      ...(data.stockStatus !== undefined && { stockStatus: data.stockStatus }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.mainImageUrl !== undefined && { mainImageUrl: data.mainImageUrl }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.images !== undefined && { images: JSON.stringify(data.images) }),
      ...(data.variants !== undefined && { variants: JSON.stringify(data.variants) }),
      ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
      ...(data.badge !== undefined && { badge: data.badge }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
    },
  });

  res.json({
    ...updated,
    features: updated.features ? JSON.parse(updated.features) : [],
    images: updated.images ? JSON.parse(updated.images) : [],
    variants: updated.variants ? JSON.parse(updated.variants) : [],
    tags: updated.tags ? JSON.parse(updated.tags) : [],
  });
});

// DELETE /api/products/:id
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!existing) throw createError("Product not found.", 404);

  await prisma.product.update({ where: { id }, data: { isDeleted: true } });
  res.status(204).send();
});
