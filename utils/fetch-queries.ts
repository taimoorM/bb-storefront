import { CartItem } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie, getCookies, setCookie } from "cookies-next";

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

export const fetchSession = async (headers: {}) => {
  const token = getCookie("session");

  const res = await fetch(`/api/storefront/session`, {
    headers,
    method: "POST",
    body: JSON.stringify({ token }),
  });
  if (!token) {
    const data = await res.json();
    console.log("data", data);

    setCookie("session", data.session.token, {
      expires: new Date(data.session.expiresAt),
      path: "/",
    });
  }
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
    mutationKey: ["cart, id"],
    mutationFn: async () => {
      fetch(`/api/storefront/cart/`, {
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
