import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AdminUser, AuthService } from "@/services/AuthService";

interface AuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthService.getCurrentUser()
      .then(setAdmin)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const user = await AuthService.login(email, password);
    setAdmin(user);
  };

  const logout = async () => {
    await AuthService.logout();
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, isLoading, login, logout, isAuthenticated: Boolean(admin) }),
    [admin, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
