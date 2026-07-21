import { apiJson } from "@/lib/api";

export interface HeroSlide {
  id: number;
  name: string;
  imgUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export const HeroSlideService = {
  // Public
  getAllActive: async (): Promise<HeroSlide[]> => {
    return apiJson<HeroSlide[]>('/hero-slides');
  },
  
  // Admin
  getAllAdmin: async (): Promise<HeroSlide[]> => {
    return apiJson<HeroSlide[]>('/hero-slides/admin');
  },

  create: async (data: Partial<HeroSlide>): Promise<HeroSlide> => {
    return apiJson<HeroSlide>('/hero-slides', { method: 'POST', data });
  },

  update: async (id: number, data: Partial<HeroSlide>): Promise<HeroSlide> => {
    return apiJson<HeroSlide>(`/hero-slides/${id}`, { method: 'PUT', data });
  },

  delete: async (id: number): Promise<void> => {
    await apiJson<void>(`/hero-slides/${id}`, { method: 'DELETE' });
  }
};
