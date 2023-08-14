"use client";

import { Cart, Category, Store, Type } from "@/types/types";
import { Session } from "inspector";
import { createContext, useContext, useEffect, useState } from "react";
import { useApp } from "./app";

interface StoreContextValue {
  categories: Category[];
  types: Type[];
  session: Session;
  cart: Cart;
  inventory: any[];
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const [session, setSession] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const { metadata, selectedStore, setIsLoading } = useApp();

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!metadata) return;

      const headers = {
        "x-public-key": metadata.publicKey,
        Accept: "application/json",
        "x-store-id": selectedStore || "",
      };

      const fetchData = async (endpoint: string) => {
        const response = await fetch(endpoint, {
          headers,
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${endpoint}: ${response.statusText}`
          );
        }
        return response.json();
      };

      try {
        const [types, categories, sessionData, inventory] = await Promise.all([
          fetchData("/api/storefront/types"),
          fetchData("/api/storefront/categories"),
          fetchData("/api/storefront/session"),
          fetchData("/api/storefront/inventory"),
        ]);

        setSession(sessionData.session);
        setCart(sessionData.cart);
        setTypes(types);
        setCategories(categories);
        setInventory(inventory);
        console.log("inventory", inventory);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }

      setIsLoading(false);
    };

    const abortController = new AbortController();
    fetchStoreData();

    return () => {
      abortController.abort();
    };
  }, [metadata, setIsLoading, selectedStore]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        types,
        session,
        cart,
        inventory,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStorefront must be used within an StoreProvider");
  }
  return context;
};
