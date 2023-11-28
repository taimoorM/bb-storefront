"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useStore } from "./store";
import Spinner from "@/components/Loaders/Spinner";

interface AuthContextValue {
  user: any;
}
export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const { session } = useStore();

  console.log(session?.customerId);
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch(`api/storefront/customers?id=${session?.customerId}`),
  });

  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useStorefront must be used within an StoreProvider");
  }
  return context;
};
