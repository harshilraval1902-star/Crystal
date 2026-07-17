import { apiJson } from "@/lib/api";

export interface AmcPlan {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  price: string;
  durationMonths: number;
  description?: string;
  serviceVisits: number;
  sparePartsCovered: boolean;
  prioritySupport: boolean;
  badge?: string;
  isActive: boolean;
  displayOrder: number;
}

const API_PATH = "/amc-plans";

export const AmcService = {
  getAll: async (): Promise<AmcPlan[]> => apiJson<AmcPlan[]>(API_PATH),
  getById: async (id: number): Promise<AmcPlan> => apiJson<AmcPlan>(`${API_PATH}/${id}`),
  create: async (payload: Omit<AmcPlan, "id" | "createdAt" | "updatedAt">): Promise<AmcPlan> =>
    apiJson<AmcPlan>(API_PATH, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<AmcPlan, "id" | "createdAt">>): Promise<AmcPlan> =>
    apiJson<AmcPlan>(`${API_PATH}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> => apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),
};
