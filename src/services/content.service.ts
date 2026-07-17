import { apiJson } from "@/lib/api";

export interface SiteServiceItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon?: string;
  accent?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Faq {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  displayOrder: number;
}

const SITE_SERVICE_API = "/site-services";
const FAQ_API = "/faqs";

export const SiteServiceService = {
  getAll: async (): Promise<SiteServiceItem[]> => apiJson<SiteServiceItem[]>(SITE_SERVICE_API),
  getById: async (id: number): Promise<SiteServiceItem> => apiJson<SiteServiceItem>(`${SITE_SERVICE_API}/${id}`),
  create: async (payload: Omit<SiteServiceItem, "id" | "createdAt" | "updatedAt">): Promise<SiteServiceItem> =>
    apiJson<SiteServiceItem>(SITE_SERVICE_API, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<SiteServiceItem, "id" | "createdAt">>): Promise<SiteServiceItem> =>
    apiJson<SiteServiceItem>(`${SITE_SERVICE_API}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> => apiJson<void>(`${SITE_SERVICE_API}/${id}`, { method: "DELETE" }),
};

export const FaqService = {
  getAll: async (): Promise<Faq[]> => apiJson<Faq[]>(FAQ_API),
  getById: async (id: number): Promise<Faq> => apiJson<Faq>(`${FAQ_API}/${id}`),
  create: async (payload: Omit<Faq, "id" | "createdAt" | "updatedAt">): Promise<Faq> =>
    apiJson<Faq>(FAQ_API, { method: "POST", data: payload }),
  update: async (id: number, payload: Partial<Omit<Faq, "id" | "createdAt">>): Promise<Faq> =>
    apiJson<Faq>(`${FAQ_API}/${id}`, { method: "PUT", data: payload }),
  delete: async (id: number): Promise<void> => apiJson<void>(`${FAQ_API}/${id}`, { method: "DELETE" }),
};

export const ContentService = {
  faqs: FaqService,
  siteServices: SiteServiceService,

  async getAll() {
    const [faqs, siteServices] = await Promise.all([
      FaqService.getAll(),
      SiteServiceService.getAll(),
    ]);
    return { faqs, siteServices };
  },

  async getById(_id: number) {
    return null;
  },

  async create(data: { type: "faq"; payload: Omit<Faq, "id" | "createdAt" | "updatedAt"> } | { type: "siteService"; payload: Omit<SiteServiceItem, "id" | "createdAt" | "updatedAt"> }) {
    if (data.type === "faq") return FaqService.create(data.payload);
    return SiteServiceService.create(data.payload);
  },

  async update(id: number, data: Partial<Omit<Faq, "id" | "createdAt">> | Partial<Omit<SiteServiceItem, "id" | "createdAt">>, type: "faq" | "siteService") {
    if (type === "faq") return FaqService.update(id, data as Partial<Omit<Faq, "id" | "createdAt">>);
    return SiteServiceService.update(id, data as Partial<Omit<SiteServiceItem, "id" | "createdAt">>);
  },

  async delete(id: number, type: "faq" | "siteService") {
    if (type === "faq") return FaqService.delete(id);
    return SiteServiceService.delete(id);
  },
};
