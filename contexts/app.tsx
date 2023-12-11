"use client";
import StoreSelect from "@/components/StoreSelect";
import { Cart, Category, Customer, Session, Store, Type } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";
import { StoreProvider } from "./store";
import { deleteCookie } from "@/app/actions";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Loaders/Spinner";
import { set } from "react-hook-form";

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
  customer: Customer | null;
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
}
export const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [metadata, setMetadata] = useState<App["metadata"] | null>(null);

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

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
          await deleteCookie("session");
          router.refresh();
        }

        if (!response.ok) {
          throw new Error(data);
        }

        setMetadata(data.metadata);
        setStores(data.stores);
        setCustomer(data.customer);
      } catch (e: any) {
        console.log(e);
      }
    };

    fetchStorefront();
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        metadata,
        stores,
        customer,
        setCustomer,
      }}
    >
      {!metadata ? (
        <Spinner />
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
