import { apiJson } from "@/lib/api";

export interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberStats {
  totalSubscribers: number;
  newThisWeek: number;
  newThisMonth: number;
  growthPercent: number;
}

export interface PaginatedSubscribers {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: SubscriberStats;
}

const API_PATH = "/subscribers";

const buildQuery = (params?: Record<string, any>) => {
  if (!params) return "";
  const filteredParams = Object.entries(params)
    .filter(([_, val]) => val !== undefined && val !== null && val !== "")
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
  return filteredParams.length > 0 ? `?${filteredParams.join("&")}` : "";
};

export const SubscriberService = {
  subscribe: async (email: string): Promise<Subscriber> =>
    apiJson<Subscriber>(API_PATH, { method: "POST", data: { email } }),

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    filter?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedSubscribers> => 
    apiJson<PaginatedSubscribers>(`${API_PATH}${buildQuery(params)}`),

  delete: async (id: number): Promise<void> => 
    apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" }),

  deleteBulk: async (ids: number[]): Promise<void> =>
    apiJson<void>(`${API_PATH}/bulk`, { method: "DELETE", data: { ids } }),

  export: async (params?: {
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    filter?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Subscriber[]> =>
    apiJson<Subscriber[]>(`${API_PATH}/export${buildQuery(params)}`, { method: "POST" }),
};
