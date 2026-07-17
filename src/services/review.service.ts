import { apiJson } from "@/lib/api";

export interface Review {
  id: number;
  createdAt: string;
  updatedAt: string;
  productId: number;
  customerName: string;
  rating: number;
  reviewText: string;
  status: "pending" | "approved" | "rejected";
}

const API_PATH = "/reviews";

export const ReviewService = {
  getAll: async (): Promise<Review[]> => apiJson<Review[]>(API_PATH),
  getById: async (id: number): Promise<Review> => apiJson<Review>(`${API_PATH}/${id}`),
  create: async (payload: Omit<Review, "id" | "createdAt" | "updatedAt">): Promise<Review> =>
    apiJson<Review>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Review, "id" | "createdAt">>): Promise<Review> =>
    apiJson<Review>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> =>
    apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
