import { deleteCookie } from "@/app/actions";
import { useMutation } from "@tanstack/react-query";
import { getCookie, setCookie } from "cookies-next";

export const fetchData = async (key: string, headers: HeadersInit) => {
  const res = await fetch(`/api/storefront/${key}`, { headers });
  return res.json();
};

export const fetchInventory = async (storeId: string, headers: HeadersInit) => {
  const res = await fetch(`/api/storefront/${storeId}/inventory`, {
    headers,
  });
  return res.json();
};

export const fetchOrder = async (token: string, headers: HeadersInit) => {
  const res = await fetch(
    `http:localhost:3000/api/storefront/checkout?token=${token}`,
    {
      headers,
    }
  );
  console.log("res", res);
  if (!res.ok) {
    throw new Error("Could not fetch order");
  }
  return res.json();
};

export const fetchCart = async (token: string, headers: HeadersInit) => {
  const res = await fetch(`/api/storefront/cart?token=${token}`, {
    headers,
  });

  console.log("res", res);

  if (!res.ok) {
    throw new Error("Could not fetch cart");
  }

  return res.json();
};

export const fetchSession = async (storeId: string, headers: HeadersInit) => {
  let token = getCookie("session");

  let res = await fetch(`/api/storefront/session`, {
    headers,
    method: "POST",
    body: JSON.stringify({ token, storeId }),
  });

  console.log("res", res);

  if (res.status === 400) {
    await deleteCookie("session");
    return null;
  }

  const data = await res.json();
  if (!token) {
    setCookie("session", data.session.token, {
      expires: new Date(data.session.expiresAt),
      path: "/",
    });
  }
  return data;
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
