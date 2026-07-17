import { apiJson } from "@/lib/api";

export interface GalleryImage {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

const API_PATH = "/gallery";

export const GalleryService = {
  getAll: async (): Promise<GalleryImage[]> => apiJson<GalleryImage[]>(API_PATH),
  getById: async (id: number): Promise<GalleryImage> => apiJson<GalleryImage>(`${API_PATH}/${id}`),
  create: async (payload: Omit<GalleryImage, "id" | "createdAt" | "updatedAt">): Promise<GalleryImage> =>
    apiJson<GalleryImage>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<GalleryImage, "id" | "createdAt">>): Promise<GalleryImage> =>
    apiJson<GalleryImage>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> =>
    apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
