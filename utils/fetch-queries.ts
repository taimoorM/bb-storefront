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
