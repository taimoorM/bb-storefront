"use client";
import StoreSelect from "@/components/StoreSelect";
import { Cart, Category, Session, Store, Type } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { StoreProvider } from "./store";
import { deleteCookie } from "@/app/actions";
import { useRouter } from "next/navigation";

interface App {
  metadata: {
    id: string;
    businessName: string;
    logo: string;
    subdomain: string;
    publicKey: string;
  };
  stores: Store[];
}

interface AppContextValue {
  metadata: App["metadata"] | null;
  stores: Store[];
}
export const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [metadata, setMetadata] = useState<App["metadata"] | null>(null);

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const store = localStorage?.getItem("bb-selected-store");
    setSelectedStore(store);
    const fetchStorefront = async () => {
      try {
        const response = await fetch("/api/init");
        const data = await response.json();

        if (response.status === 404) {
          localStorage.removeItem("bb-selected-store");
          await deleteCookie("bb-access-token");
          router.refresh();
        }

        if (!response.ok) {
          throw new Error(data);
        }

        setMetadata(data.metadata);
        setStores(data.stores);
      } catch (e: any) {
        console.log(e);
      }
    };

    fetchStorefront();
  }, []);

  return (
    <AppContext.Provider
      value={{
        metadata,
        stores,
      }}
    >
      {!metadata ? (
        <p>Loading...</p>
      ) : (
        <>
          {!selectedStore ? (
            <StoreSelect
              selectedStore={selectedStore}
              onSelect={(id) => {
                localStorage.setItem("bb-selected-store", id);
                setSelectedStore(id);
              }}
            />
          ) : (
            <StoreProvider selectedStore={selectedStore}>
              {props.children}
            </StoreProvider>
          )}
        </>
      )}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useStorefront must be used within an StoreProvider");
  }
  return context;
};
