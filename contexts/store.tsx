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
  Customer,
} from "@/types/types";

import {
  createContext,
  use,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApp } from "./app";
import {
  UseMutationResult,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import {
  fetchCustomer,
  fetchData,
  fetchInventory,
  fetchSession,
} from "@/utils/fetch-queries";
import { useToast } from "@/components/ui/use-toast";
import { deleteCookie } from "@/app/actions";
import Spinner from "@/components/Loaders/Spinner";
import { useSession } from "next-auth/react";

interface StoreContextValue {
  categories: Category[];
  brands: Brand[];
  types: Type[];
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  customer: Customer | null;
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  inventory: Inventory | null;
  selectedStore: Store;
  useUpdateCart: (
    token: string,
    id: string,
    action: "add" | "subtract" | "remove",
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
  token: string | null;
}> = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const { metadata, stores } = useApp();
  const { toast } = useToast();
  const { data: authSession } = useSession();

  const headers = useMemo(() => {
    return {
      "x-public-key": (metadata?.publicKey as string) || "",
      Accept: "application/json",
    };
  }, [metadata]);

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
    staleTime: 1000 * 60,
  });

  const useUpdateCart = (
    token: string,
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
            token,
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

  const setAppState = (newState: {
    session: Session | null;
    cart: Cart | null;
    types: Type[];
    categories: Category[];
    brands: Brand[];
    inventory: Inventory | null;
    customer?: Customer | null;
  }) => {
    setSession(newState.session);
    if (newState.customer) {
      setCustomer(newState.customer);
    }
    setCart(newState.cart);
    setTypes(newState.types);
    setCategories(newState.categories);
    setBrands(newState.brands);
    setInventory(newState.inventory);
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

      setAppState({
        session: sessionData?.session,
        customer: sessionData?.customer,
        cart: sessionData?.cart,
        types,
        categories,
        brands,
        inventory: data?.inventory,
      });
    }
  }, [storefrontData, isError, error, toast, headers, props.selectedStore]);

  const memoizedValues = useMemo(() => {
    return {
      categories,
      types,
      session,
      setSession,
      cart,
      setCart,
      inventory,
      customer,
      setCustomer,
      selectedStore: stores.find(
        (store) => store.id === props.selectedStore
      ) as Store,
      brands,
    };
  }, [
    categories,
    types,
    session,
    cart,
    setCart,
    inventory,
    customer,
    stores,
    props.selectedStore,
    brands,
  ]);

  const values = {
    ...memoizedValues,
    useUpdateCart,
    headers,
  };

  return (
    <StoreContext.Provider value={values}>
      {isLoading ? <Spinner /> : props.children}
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
