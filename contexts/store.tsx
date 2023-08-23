"use client";

import {
  Brand,
  Cart,
  CartItem,
  Category,
  Inventory,
  Session,
  Type,
} from "@/types/types";

import { createContext, use, useContext, useEffect, useState } from "react";
import { useApp } from "./app";
import {
  UseMutationResult,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { fetchData, fetchInventory, fetchSession } from "@/utils/fetch-queries";

interface StoreContextValue {
  categories: Category[];
  brands: Brand[];
  types: Type[];
  session: Session | null;
  cart: Cart | null;
  inventory: Inventory | null;
  selectedStore: string | null;
  useUpdateCart: (
    sessionId: string,
    item: {
      id: string;
      quantity: number;
    },
    headers: HeadersInit
  ) => UseMutationResult<Cart, unknown, void, unknown>;
  headers: {
    "x-public-key": string;
    Accept: string;
  };
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
  selectedStore: string;
}> = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);

  const { metadata } = useApp();

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
    "x-public-key": (metadata?.publicKey as string) || "",
    Accept: "application/json",
  };

  const {
    data: storefrontData,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["storefrontData"],
    queryFn: async () =>
      Promise.all([
        fetchData("types", headers),
        fetchData("categories", headers),
        fetchData("brands", headers),
        fetchSession(headers),
        fetchInventory(headers, props.selectedStore),
      ]),
  });

  const useUpdateCart = (
    sessionId: string,
    item: {
      id: string;
      quantity: number;
    },
    headers: any
  ) => {
    return useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/storefront/cart/`, {
          headers,
          method: "PATCH",

          body: JSON.stringify({
            sessionId,
            id: item.id,
            quantity: item.quantity,
          }),
        });
        const data = await res.json();
        console.log("data", data);
        return data;
      },
      onSuccess(data) {
        setCart(data);
      },
    });
  };

  useEffect(() => {
    if (storefrontData) {
      const [types, categories, brands, sessionData, data] = storefrontData;
      setSession(sessionData.session);
      setCart(sessionData.cart);
      setTypes(types);
      setCategories(categories);
      setBrands(brands);
      setInventory(data.inventory);
    }
  }, [storefrontData]);

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
        useUpdateCart,
        headers,
      }}
    >
      {isLoading ? <div>Loading...</div> : props.children}
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
