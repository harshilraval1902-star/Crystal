import { apiJson } from "@/lib/api";

export interface Testimonial {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  review: string;
  rating: number;
  location?: string;
  designation?: string;
  photoUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

const API_PATH = "/testimonials";

export const TestimonialService = {
  getAll: async (): Promise<Testimonial[]> => apiJson<Testimonial[]>(API_PATH),
  getById: async (id: number): Promise<Testimonial> => apiJson<Testimonial>(`${API_PATH}/${id}`),
  create: async (payload: Omit<Testimonial, "id" | "createdAt" | "updatedAt">): Promise<Testimonial> =>
    apiJson<Testimonial>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Testimonial, "id" | "createdAt">>): Promise<Testimonial> =>
    apiJson<Testimonial>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> =>
    apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
