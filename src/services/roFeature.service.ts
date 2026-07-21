import { apiJson } from "@/lib/api";

export interface ROFeature {
  id: number;
  title: string;
  description: string;
  iconName: string | null;
  isActive: boolean;
  displayOrder: number;
}

export const ROFeatureService = {
  // Public
  getAllActive: async (): Promise<ROFeature[]> => {
    return apiJson<ROFeature[]>('/ro-features');
  },
  
  // Admin
  getAllAdmin: async (): Promise<ROFeature[]> => {
    return apiJson<ROFeature[]>('/ro-features/admin');
  },

  create: async (data: Partial<ROFeature>): Promise<ROFeature> => {
    return apiJson<ROFeature>('/ro-features', { method: 'POST', data });
  },

  update: async (id: number, data: Partial<ROFeature>): Promise<ROFeature> => {
    return apiJson<ROFeature>(`/ro-features/${id}`, { method: 'PUT', data });
  },

  delete: async (id: number): Promise<void> => {
    await apiJson<void>(`/ro-features/${id}`, { method: 'DELETE' });
  }
};
