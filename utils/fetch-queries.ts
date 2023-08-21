import { CartItem } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const fetchData = async (key: string, headers: {}) => {
  const res = await fetch(`/api/storefront/${key}`, { headers });
  return res.json();
};

export const fetchInventory = async (headers: {}, storeId: string) => {
  const res = await fetch(`/api/storefront/${storeId}/inventory`, {
    headers,
  });
  return res.json();
};

export const useUpdateCart = (
  sessionId: string,
  item: {
    id: string;
    quantity: number;
  },
  headers: any
) => {
  return useMutation({
    mutationKey: ["cart"],
    mutationFn: async () => {
      return fetch(`/api/storefront/cart/`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          sessionId,
          inventoryItemId: item.id,
          quantity: item.quantity,
        }),
      });
    },
  });
};
