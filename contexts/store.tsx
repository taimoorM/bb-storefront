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
      if (metadata) {
        const headers = {
          "x-public-key": metadata.publicKey,
          Accept: "application/json",
        };
        const [types, categories, { session, cart }, inventory] =
          await Promise.all([
            fetch("/api/storefront/types", { headers }).then((res) =>
              res.json()
            ),
            fetch("/api/storefront/categories", {
              headers,
            }).then((res) => res.json()),
            fetch("/api/storefront/session", {
              headers,
            }).then((res) => res.json()),
            fetch("/api/storefront/inventory", {
              headers,
            }).then((res) => res.json()),
          ]);
      }

      setSession(session);
      setCart(cart);
      setTypes(types);
      setCategories(categories);
    };
    fetchStoreData();
  }, [metadata, categories, types, session, cart]);

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
};
