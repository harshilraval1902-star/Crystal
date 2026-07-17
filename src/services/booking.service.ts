import { apiJson } from "@/lib/api";

export interface Booking {
  id: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  serviceType?: string;
  message?: string;
  status: "new" | "contacted" | "assigned" | "in_progress" | "completed" | "cancelled";
}

const API_PATH = "/service-requests";

export const BookingService = {
  getAll: async (): Promise<Booking[]> => apiJson<Booking[]>(API_PATH),
  getById: async (id: number): Promise<Booking> => apiJson<Booking>(`${API_PATH}/${id}`),
  create: async (payload: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> =>
    apiJson<Booking>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Booking, "id" | "createdAt">>): Promise<Booking> =>
    apiJson<Booking>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> => apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
