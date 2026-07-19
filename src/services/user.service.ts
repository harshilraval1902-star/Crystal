import apiClient from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Support";
  status: "active" | "invited" | "suspended";
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export const UserService = {
  getAll: async (): Promise<AdminUser[]> => {
    const res = await apiClient.get("/admin/users");
    return res.data as AdminUser[];
  },

  create: async (data: Partial<AdminUser> & { password?: string }): Promise<AdminUser> => {
    const res = await apiClient.post("/admin/users", data);
    return res.data as AdminUser;
  },

  update: async (id: number, data: Partial<AdminUser>): Promise<AdminUser> => {
    const res = await apiClient.put(`/admin/users/${id}`, data);
    return res.data as AdminUser;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },
};
