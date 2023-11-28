"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { useStore } from "./store";

interface AuthContextValue {
  user: any;
}
export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const { session } = useStore();
  console.log(session);
  const { data } = useQuery({ queryKey: ["user"], queryFn: () => {} });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useStorefront must be used within an StoreProvider");
  }
  return context;
};
