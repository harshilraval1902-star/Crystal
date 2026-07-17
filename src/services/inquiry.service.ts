import { apiJson } from "@/lib/api";

export interface Inquiry {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
}

const API_PATH = "/inquiries";

export const InquiryService = {
  getAll: async (): Promise<Inquiry[]> => apiJson<Inquiry[]>(API_PATH),
  getById: async (id: number): Promise<Inquiry> => apiJson<Inquiry>(`${API_PATH}/${id}`),
  create: async (payload: Omit<Inquiry, "id" | "createdAt" | "updatedAt">): Promise<Inquiry> =>
    apiJson<Inquiry>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Inquiry, "id" | "createdAt">>): Promise<Inquiry> =>
    apiJson<Inquiry>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> => apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
