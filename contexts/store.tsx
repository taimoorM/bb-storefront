"use client";

import {
  Brand,
  Cart,
  CartItem,
  Category,
  Inventory,
  InventoryItem,
  Session,
  Type,
  InventoryMap,
  Store,
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
import { useToast } from "@/components/ui/use-toast";

interface StoreContextValue {
  categories: Category[];
  brands: Brand[];
  types: Type[];
  session: Session | null;
  cart: Cart | null;
  inventory: Inventory | null;
  selectedStore: Store;
  useUpdateCart: (
    sessionId: string,
    id: string,
    action: "add" | "subtract" | "remove",
    headers: HeadersInit
  ) => UseMutationResult<Cart, unknown, void, unknown>;
  headers: {
    "x-public-key": string;
    Accept: string;
  };
  inventoryMap: InventoryMap;
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
  const [inventoryMap, setInventoryMap] = useState<InventoryMap>({});

  const { metadata, stores } = useApp();
  const { toast } = useToast();

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
        fetchSession(props.selectedStore, headers),
        fetchInventory(props.selectedStore, headers),
      ]),
  });

  const useUpdateCart = (
    sessionId: string,
    id: string,
    action: "add" | "subtract" | "remove",
    headers: HeadersInit
  ) => {
    const cartItem = cart?.items.find((i) => i.id === id);
    let quantity = cartItem?.quantity || 0;
    switch (action) {
      case "add":
        quantity = quantity + 1;
        break;
      case "subtract":
        quantity = quantity !== 0 ? quantity - 1 : 0;
        break;
      case "remove":
        quantity = 0;
        break;
      default:
        break;
    }
    return useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/storefront/cart/`, {
          headers,
          method: "PATCH",

          body: JSON.stringify({
            sessionId,
            id,
            quantity,
          }),
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        console.log("data", data);
        return data;
      },
      onSuccess(data) {
        setCart(data);
      },
      onError(error: Error) {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });
  };

  useEffect(() => {
    if (isError) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
      });
    }
    if (storefrontData) {
      const [types, categories, brands, sessionData, data] = storefrontData;
      const inventoryMap: InventoryMap = {};

      for (let key in data.inventory.items) {
        for (let item of data.inventory.items[key]) {
          inventoryMap[item.id] = item;
        }
      }

      setSession(sessionData.session);
      setCart(sessionData.cart);
      setTypes(types);
      setCategories(categories);
      setBrands(brands);
      setInventory(data.inventory);
      setInventoryMap(inventoryMap);
    }
  }, [storefrontData, isError, error, toast]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        types,
        session,
        cart,
        inventory,
        selectedStore: stores.find(
          (store) => store.id === props.selectedStore
        ) as Store,
        brands,
        useUpdateCart,
        headers,
        inventoryMap,
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
