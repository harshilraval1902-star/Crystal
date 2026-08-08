import { Request, Response } from "express";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { asyncHandler } from "../utils/asyncHandler";
import { createError } from "../middleware/errorHandler";
import { deleteUploadedFile } from "../utils/file";
import { mapBooleans, buildUpdateQuery } from "../utils/dbHelpers";

const BOOLEAN_FIELDS = ["featured", "isActive", "isDeleted"];

function safeParseJsonArray(jsonStr: string | null | undefined): string[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseProduct(product: any) {
  const mapped = mapBooleans(product, BOOLEAN_FIELDS);
  return {
    ...mapped,
    features: safeParseJsonArray(mapped.features),
    images: safeParseJsonArray(mapped.images),
    variants: safeParseJsonArray(mapped.variants),
    tags: safeParseJsonArray(mapped.tags),
  };
}

// GET /api/products
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const [products] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM product WHERE isDeleted = ? ORDER BY displayOrder ASC, createdAt DESC",
    [false]
  );
  res.json(products.map(parseProduct));
});

// GET /api/products/:id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [products] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM product WHERE id = ? AND isDeleted = ? LIMIT 1",
    [id, false]
  );
  
  if (!products[0]) throw createError("Product not found.", 404);

  res.json(parseProduct(products[0]));
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
  const [existing] = await pool.query<RowDataPacket[]>("SELECT id FROM product WHERE slug = ? LIMIT 1", [data.slug]);
  if (existing[0]) throw createError("A product with this slug already exists.", 409);

  const insertData = {
    name: data.name,
    slug: data.slug,
    price: data.price,
    brand: data.brand ?? null,
    model: data.model ?? null,
    category: data.category ?? null,
    discountPrice: data.discountPrice ?? null,
    description: data.description ?? null,
    features: data.features ? JSON.stringify(data.features) : null,
    specifications: data.specifications ?? null,
    warranty: data.warranty ?? null,
    stockStatus: data.stockStatus ?? "in_stock",
    stock: data.stock ?? null,
    featured: data.featured ?? false,
    mainImageUrl: data.mainImageUrl ?? null,
    thumbnail: data.thumbnail ?? null,
    image: data.image ?? null,
    images: data.images ? JSON.stringify(data.images) : null,
    variants: data.variants ? JSON.stringify(data.variants) : null,
    tags: data.tags ? JSON.stringify(data.tags) : null,
    badge: data.badge ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder ?? 0,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO product (
      name, slug, price, brand, model, category, discountPrice, description,
      features, specifications, warranty, stockStatus, stock, featured,
      mainImageUrl, thumbnail, image, images, variants, tags, badge,
      seoTitle, seoDescription, isActive, displayOrder, isDeleted, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      insertData.name, insertData.slug, insertData.price, insertData.brand,
      insertData.model, insertData.category, insertData.discountPrice, insertData.description,
      insertData.features, insertData.specifications, insertData.warranty, insertData.stockStatus,
      insertData.stock, insertData.featured, insertData.mainImageUrl, insertData.thumbnail,
      insertData.image, insertData.images, insertData.variants, insertData.tags, insertData.badge,
      insertData.seoTitle, insertData.seoDescription, insertData.isActive, insertData.displayOrder,
      insertData.isDeleted, insertData.createdAt, insertData.updatedAt
    ]
  );

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM product WHERE id = ?", [result.insertId]);
  res.status(201).json(parseProduct(rows[0]));
});

// PUT /api/products/:id
export const update = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM product WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Product not found.", 404);
  const existing = existingRows[0];

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
    const [slugExists] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM product WHERE slug = ? AND id != ? AND isDeleted = ? LIMIT 1",
      [data.slug, id, false]
    );
    if (slugExists[0]) throw createError("A product with this slug already exists.", 409);
  }

  const updateData: Record<string, any> = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.brand !== undefined) updateData.brand = data.brand;
  if (data.model !== undefined) updateData.model = data.model;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
  if (data.specifications !== undefined) updateData.specifications = data.specifications;
  if (data.warranty !== undefined) updateData.warranty = data.warranty;
  if (data.stockStatus !== undefined) updateData.stockStatus = data.stockStatus;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.mainImageUrl !== undefined) updateData.mainImageUrl = data.mainImageUrl;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
  if (data.variants !== undefined) updateData.variants = JSON.stringify(data.variants);
  if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
  if (data.badge !== undefined) updateData.badge = data.badge;
  if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

  const queryParts = buildUpdateQuery("product", updateData);
  if (queryParts) {
    await pool.execute(
      `UPDATE product SET ${queryParts.setClause} WHERE id = ?`,
      [...queryParts.values, id]
    );
  }

  const [updatedRows] = await pool.query<RowDataPacket[]>("SELECT * FROM product WHERE id = ?", [id]);
  res.json(parseProduct(updatedRows[0]));
});

// DELETE /api/products/:id
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [existingRows] = await pool.query<RowDataPacket[]>("SELECT * FROM product WHERE id = ? AND isDeleted = ? LIMIT 1", [id, false]);
  if (!existingRows[0]) throw createError("Product not found.", 404);
  const existing = existingRows[0];

  // Safely delete uploaded files
  await deleteUploadedFile(existing.mainImageUrl);
  await deleteUploadedFile(existing.thumbnail);
  await deleteUploadedFile(existing.image);
  
  if (existing.images) {
    try {
      const parsedImages = JSON.parse(existing.images);
      if (Array.isArray(parsedImages)) {
        await Promise.all(parsedImages.map(img => deleteUploadedFile(img)));
      }
    } catch {
      // Ignore parse errors
    }
  }

  await pool.execute("UPDATE product SET isDeleted = ?, updatedAt = NOW() WHERE id = ?", [true, id]);
  res.status(204).send();
});
