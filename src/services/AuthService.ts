import apiClient, { apiJson, clearTokens, setTokens } from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AUTH_STORAGE_KEY = "crystal_water_admin_session";

function readSession(): AdminUser | null {
  try {
    const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedSession) return null;
    return JSON.parse(storedSession) as AdminUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function writeSession(user: AdminUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export const AuthService = {
  getCurrentUser: async (): Promise<AdminUser | null> => {
    const session = readSession();
    if (!session) return null;
    try {
      const user = await apiJson<AdminUser>("/admin/auth/me");
      writeSession(user);
      return user;
    } catch {
      clearTokens();
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  login: async (email: string, password: string): Promise<AdminUser> => {
    const response = await apiClient.post("/admin/auth/login", { email, password });
    const { accessToken, refreshToken, user } = response.data as {
      accessToken: string;
      refreshToken?: string;
      user: AdminUser;
    };
    setTokens(accessToken, refreshToken ?? "");
    writeSession(user);
    return user;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/admin/auth/logout");
    } catch {
      // ignore logout failures, still clear session locally
    }
    clearTokens();
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
