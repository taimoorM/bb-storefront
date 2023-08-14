"use client";

import { Cart, Category, Store } from "@/types/types";
import { Session } from "inspector";
import { createContext, useContext, useEffect, useState } from "react";
import { Type } from "typescript";
import { useApp } from "./app";

interface StoreContextValue {
  categories: Category[];
  types: Type[];
  session: Session;
  cart: Cart;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{
  selectedStore: string | null;
  children: React.ReactNode;
}> = (props) => {
  const [session, setSession] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const { metadata } = useApp();

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!metadata) return;

      const headers = {
        "x-public-key": metadata.publicKey,
        Accept: "application/json",
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
        const [types, categories, sessionData] = await Promise.all([
          fetchData("/api/storefront/types"),
          fetchData("/api/storefront/categories"),
          fetchData("/api/storefront/session"),
          // fetchData("/api/storefront/inventory"),
        ]);

        setSession(sessionData.session);
        setCart(sessionData.cart);
        setTypes(types);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    const abortController = new AbortController();
    fetchStoreData();

    return () => {
      abortController.abort();
    };
  }, [metadata]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        types,
        session,
        cart,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};
