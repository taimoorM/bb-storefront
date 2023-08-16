"use client";

import { Brand, Cart, Category, Inventory, Type } from "@/types/types";
import { Session } from "inspector";
import { createContext, use, useContext, useEffect, useState } from "react";
import { useApp } from "./app";
import { useQueries } from "@tanstack/react-query";
import { fetchData, getInitialQueries, useTypes } from "@/utils/fetch-queries";
import { headers } from "next/headers";

interface StoreContextValue {
  categories: Category[];
  brands: Brand[];
  types: Type[];
  session: Session | null;
  cart: Cart | null;
  inventory: Inventory | null;
  selectedStore: string | null;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
  selectedStore: string | null;
}> = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);

  const { metadata, setIsLoading } = useApp();

  // useEffect(() => {
  //   const fetchStoreData = async () => {
  //     if (!metadata) return;

  //     const headers = {
  //       "x-public-key": metadata.publicKey,
  //       Accept: "application/json",
  //       "x-store-id": props.selectedStore || "",
  //     };

  //     const fetchData = async (endpoint: string) => {
  //       const response = await fetch(endpoint, {
  //         headers,
  //         signal: abortController.signal,
  //       });
  //       if (!response.ok) {
  //         throw new Error(
  //           `Failed to fetch ${endpoint}: ${response.statusText}`
  //         );
  //       }
  //       return response.json();
  //     };

  //     try {
  //       const [types, categories, brands, sessionData, data] =
  //         await Promise.all([
  //           fetchData("/api/storefront/types"),
  //           fetchData("/api/storefront/categories"),
  //           fetchData("/api/storefront/brands"),
  //           fetchData("/api/storefront/session"),
  //           fetchData("/api/storefront/inventory"),
  //         ]);

  //       setSession(sessionData.session);
  //       setCart(sessionData.cart);
  //       setTypes(types);
  //       setCategories(categories);
  //       setBrands(brands);
  //       setInventory(data.inventory);
  //     } catch (error) {
  //       console.error("Error fetching store data:", error);
  //     }

  //     setIsLoading(false);
  //   };

  //   const abortController = new AbortController();
  //   fetchStoreData();

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [metadata, setIsLoading, props.selectedStore]);

  const headers = {
    "x-public-key": metadata?.publicKey,
    Accept: "application/json",
    "x-store-id": props.selectedStore || "",
  };

  const queries = getInitialQueries(headers);

  const results = useQueries({ queries });

  useEffect(() => {
    if (results.some((result) => !result.isLoading)) {
      setIsLoading(false);
    }
    if (results.some((result) => !result.isSuccess)) return;

    const [types, categories, brands, sessionData, data] = results;

    setSession(sessionData.data.session);
    setCart(sessionData.data.cart);
    setTypes(types.data);
    setCategories(categories.data);
    setBrands(brands.data);
    setInventory(data.data.inventory);
    setIsLoading(false);
  }, [results, setIsLoading]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        types,
        session,
        cart,
        inventory,
        selectedStore: props.selectedStore,
        brands,
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
