import { auth } from "@/auth";
import CheckoutDetailsForm from "@/components/Checkout/CheckoutDetailsForm";
import CheckoutTotals from "@/components/Checkout/CheckoutTotals";
import CheckoutWrapper from "@/components/Checkout/CheckoutWrapper";
import OrderProductList from "@/components/Checkout/OrderProductList";
import Price from "@/components/Price";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
import { Check } from "lucide-react";
import { Session } from "next-auth/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session");
  const publicKey = cookieStore.get("bb-access-token");

  console.log(token);
  console.log(publicKey);

  const headers = {
    "x-public-key": publicKey?.value || "",
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  let order: Order | undefined;
  let cart: Cart | undefined;
  let data: {
    order: Order;
    clientSecret: string;
    stripeId: string;
  } | null = null;
  let session: Session | null = null;

  try {
    session = await auth();
    const res = await fetch(
      `http:localhost:3000/api/storefront/checkout?token=${token?.value}`,
      {
        headers,
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        const cartRes = await fetch(
          `http:localhost:3000/api/storefront/cart?token=${token?.value}`,
          {
            headers,
          }
        );

        if (!cartRes.ok) {
          throw new Error("Could not fetch cart");
        }
        cart = await cartRes.json();
      } else {
        throw new Error(`Unexpected server response: ${res.statusText}`);
      }
    } else {
      data = await res.json();
      order = data?.order;
    }
  } catch (e) {
    console.log(e);
    redirect("/cart");
  }

  return (
    <CheckoutWrapper data={data} order={order} cart={cart} session={session} />
  );
}
