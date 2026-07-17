import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminSearchContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const AdminSearchContext = createContext<AdminSearchContextValue | undefined>(undefined);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");

  return <AdminSearchContext.Provider value={{ search, setSearch }}>{children}</AdminSearchContext.Provider>;
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error("useAdminSearch must be used within AdminSearchProvider");
  }
  return context;
}
