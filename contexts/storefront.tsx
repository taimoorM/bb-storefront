"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface Storefront {
  id: string;
  businessName: string;
  logo: string;
  subdomain: string;
}

interface StorefrontContextValue {
  storefront: Storefront | null;
  isLoading: boolean;
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

  useEffect(() => {
    const fetchStorefront = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/init");
        const data: Storefront = await response.json();
        console.log(data);
        // Optionally, validate the shape of data using runtime checks

        setStorefront(data);
      } catch (e) {
        console.error("Failed to fetch storefront:", e);
        // You can set an error state here and show feedback to users if needed
      }
      setIsLoading(false);
    };

    fetchStorefront();
  }, []);

  return (
    <StorefrontContext.Provider value={{ storefront, isLoading }}>
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
