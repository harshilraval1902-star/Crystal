import { apiJson } from "@/lib/api";

export interface Product {
  id: number;
  createdAt: string;
  updatedAt: string;
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
  isActive: boolean;
  displayOrder: number;
}

const API_PATH = "/products";

export const ProductService = {
  getAll: async (): Promise<Product[]> => apiJson<Product[]>(API_PATH),
  getById: async (id: number): Promise<Product> => apiJson<Product>(`${API_PATH}/${id}`),
  create: async (payload: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> =>
    apiJson<Product>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> =>
    apiJson<Product>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> =>
    apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
