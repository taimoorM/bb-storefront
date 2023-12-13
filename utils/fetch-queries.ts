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
  const res = await fetch(`/api/storefront/checkout?token=${token}`, {
    headers,
  });

  console.log("res", res);

  if (!res.ok) {
    switch (res.status) {
      case 400:
        throw new Error("Invalid token");
      case 404:
        throw new Error("Order not found");
      default:
        throw new Error("Could not fetch order");
    }
  }
  return res.json();
};

export const fetchCart = async (token: string, headers: HeadersInit) => {
  const res = await fetch(`/api/storefront/cart?token=${token}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error("Could not fetch cart");
  }

  return res.json();
};

export const fetchSession = async (
  storeId: string,
  headers: HeadersInit,
  token: string | null
) => {
  console.log("token", token);
  let res = null;
  if (token) {
    res = await fetch(`/api/storefront/session?token=${token}`, {
      headers,
    });
  }

  if ((res && !res.ok) || !res) {
    await deleteCookie("session");
    const newRes = await fetch(`/api/storefront/session`, {
      headers,
      method: "POST",
      body: JSON.stringify({ storeId }),
    });

    if (!newRes.ok) {
      throw new Error("Could not fetch  new session");
    }

    const data = await newRes.json();

    setCookie("session", data.session.token, {
      expires: new Date(data.session.expiresAt),
      path: "/",
    });

    return data;
  }

  const data = await res.json();

  return data;
};

export const fetchCustomer = async () => {
  const res = await fetch(`/api/customer`);

  if (!res.ok) {
    return null;
  }
  return res.json();
};
