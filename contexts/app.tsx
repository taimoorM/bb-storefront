"use client";
import StoreSelect from "@/components/StoreSelect";
import { Cart, Category, Session, Store, Type } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { StoreProvider } from "./store";

interface App {
  metadata: {
    id: string;
    businessName: string;
    logo: string;
    subdomain: string;
    publicKey: string;
  };
  stores: any[];
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

  useEffect(() => {
    const store = localStorage?.getItem("bb-selected-store");
    setSelectedStore(store);
    const fetchStorefront = async () => {
      try {
        const response = await fetch("/api/init");
        const data: App = await response.json();

        setMetadata(data.metadata);
        setStores(data.stores);
      } catch (e) {
        console.error("Failed to fetch storefront:", e);
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
