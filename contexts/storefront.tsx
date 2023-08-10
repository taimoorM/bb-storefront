"use client";
import { Category, Type } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";

interface Storefront {
  metadata: {
    id: string;
    businessName: string;
    logo: string;
    subdomain: string;
    publicKey: string;
  };
  stores: any[];
}

interface StorefrontContextValue {
  metadata: Storefront["metadata"] | null;
  isLoading: boolean;
  categories: Category[];
  types: Type[];
  stores: any[];
  //   setStorefront: React.Dispatch<React.SetStateAction<Storefront | null>>;
}
export const StorefrontContext = createContext<StorefrontContextValue | null>(
  null
);

export const StorefrontProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [metadata, setMetadata] = useState<Storefront["metadata"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  const [cart, setCart] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [stores, setStores] = useState<Storefront["stores"]>([]);

  useEffect(() => {
    const fetchStorefront = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/init");
        const storefront: Storefront = await response.json();

        console.log("storefront", storefront);

        const headers = {
          "x-public-key": storefront.metadata.publicKey,
          Accept: "application/json",
        };

        const [types, categories, { session, cart }] = await Promise.all([
          fetch("/api/storefront/types", { headers }).then((res) => res.json()),
          fetch("/api/storefront/categories", {
            headers,
          }).then((res) => res.json()),
          fetch("/api/storefront/session", {
            headers,
          }).then((res) => res.json()),
        ]);

        console.log("types", types);
        console.log("categories", categories);
        console.log("session", session);
        console.log("cart", cart);

        setMetadata(storefront.metadata);
        setStores(storefront.stores);
        setSession(session);
        setCart(cart);
        setTypes(types);
        setCategories(categories);
      } catch (e) {
        console.error("Failed to fetch storefront:", e);
      }
      setIsLoading(false);
    };

    fetchStorefront();
  }, []);

  return (
    <StorefrontContext.Provider
      value={{ metadata, isLoading, categories, types, stores }}
    >
      {props.children}
    </StorefrontContext.Provider>
  );
};

export const useStorefront = (): StorefrontContextValue => {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within an StoreProvider");
  }
  return context;
};
