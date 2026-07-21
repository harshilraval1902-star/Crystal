import { apiJson } from "@/lib/api";

export type Settings = Record<string, string>;

const API_PATH = "/settings";

export const SettingsService = {
  async getAll(): Promise<Settings> {
    return apiJson<Settings>(API_PATH);
  },

  async getById(id: string): Promise<string | null> {
    try {
      const data = await apiJson<Record<string, string>>(API_PATH);
      return data[id] ?? null;
    } catch {
      return null;
    }
  },

  async create(data: Record<string, string>): Promise<Settings> {
    return apiJson<Settings>(API_PATH, { method: "POST", data });
  },

  async update(_id: string, data: Record<string, string>): Promise<Settings> {
    return apiJson<Settings>(API_PATH, { method: "PUT", data });
  },

  async delete(id: string): Promise<void> {
    await apiJson<void>(`${API_PATH}/${id}`, { method: "DELETE" });
  },
};
