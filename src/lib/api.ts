import axios, { AxiosError } from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
  : import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE.replace(/\/admin\/?$/, "")}/api`;

let accessToken: string | null = localStorage.getItem("access_token");
let refreshToken: string | null = localStorage.getItem("refresh_token");

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getAccessToken() {
  return accessToken;
}

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;

  try {
    const response = await axios.post(
      `${API}/admin/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" }, withCredentials: true },
    );

    const data = response.data as { accessToken: string; refreshToken?: string };
    accessToken = data.accessToken;
    if (data.refreshToken) {
      refreshToken = data.refreshToken;
      localStorage.setItem("refresh_token", data.refreshToken);
    }
    localStorage.setItem("access_token", accessToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest.url?.endsWith("/admin/auth/login")) &&
      !(originalRequest.url?.endsWith("/admin/auth/refresh")) &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        if (accessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      }
      clearTokens();
      window.location.href = `${BASE}/admin/login`;
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  },
);

export async function apiJson<T>(path: string, options: { method?: string; data?: unknown } = {}): Promise<T> {
  const response = await apiClient.request<T>({
    url: path,
    method: options.method ?? "GET",
    data: options.data,
  });
  return response.data;
}

export default apiClient;
