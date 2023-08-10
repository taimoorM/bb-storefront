"use client";
import { Category, Type } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";

interface Storefront {
  id: string;
  businessName: string;
  logo: string;
  subdomain: string;
  publicKey: string;
}

interface StorefrontContextValue {
  storefront: Storefront | null;
  isLoading: boolean;
  categories: Category[];
  types: Type[];
  //   setStorefront: React.Dispatch<React.SetStateAction<Storefront | null>>;
}
export const StorefrontContext = createContext<StorefrontContextValue | null>(
  null
);

export const StorefrontProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  useEffect(() => {
    const fetchStorefront = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/init");
        const storefront: Storefront = await response.json();

        console.log("storefront", storefront);

        const headers = {
          "x-public-key": storefront.publicKey,
          Accept: "application/json",
        };

        const [types, categories] = await Promise.all([
          fetch("/api/storefront/types", { headers }).then((res) => res.json()),
          fetch("/api/storefront/categories", {
            headers,
          }).then((res) => res.json()),
        ]);

        console.log("types", types);
        console.log("categories", categories);

        setStorefront(storefront);
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
      value={{ storefront, isLoading, categories, types }}
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
