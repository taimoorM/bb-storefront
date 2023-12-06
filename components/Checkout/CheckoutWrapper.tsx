"use client";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
import CheckoutDetailsForm from "./CheckoutDetailsForm";
import CheckoutTotals from "./CheckoutTotals";
import OrderProductList from "./OrderProductList";
import { use, useEffect, useState } from "react";
import { Label } from "../ui/label";
import StripeElementsWrapper from "./StripeElementsWrapper";
import { Session } from "next-auth/types";
import { useStore } from "@/contexts/store";
import { useQuery } from "@tanstack/react-query";
import { fetchCart, fetchOrder } from "@/utils/fetch-queries";
import { useRouter } from "next/navigation";
import Spinner from "../Loaders/Spinner";

interface OrderData {
  order: Order;
  clientSecret: string;
  stripeId: string;
}

function CheckoutWrapper({
  token,
  headers,
}: {
  token: string | undefined;
  headers: HeadersInit;
}) {
  const { cart: storeCart, setCart } = useStore();
  const router = useRouter();

  const { data, error, isFetched } = useQuery<OrderData>({
    queryKey: ["order"],
    queryFn: async () => {
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
    },

    retry: false,
  });

  console.log(error);

  const {
    data: cart,
    error: cartError,
    isFetched: cartIsFetched,
  } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => fetchCart(token as string, headers),
  });

  if (cartError) {
    router.push("/cart");
  }

  const [currentOrderData, setCurrentOrderData] = useState<
    OrderData | undefined
  >(data);

  const items = data ? data.order.items : cart?.items;

  console.log(items);

  const subTotal = data ? data.order.totals.subtotal : cart?.subTotal;

  const currentOrder = currentOrderData ? currentOrderData.order : null;
  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>

        {!isFetched || (error && !cartIsFetched) ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-5 py-4 gap-5">
            <div className="col-span-3">
              <CheckoutDetailsForm
                setOrderData={setCurrentOrderData}
                initialData={currentOrder}
              />
            </div>
            <div className="col-span-2">
              <OrderProductList items={items as OrderItem[] | CartItem[]} />

              <CheckoutTotals
                subTotal={subTotal as number}
                totals={currentOrderData ? currentOrderData.order.totals : null}
              />
              {currentOrderData && (
                <StripeElementsWrapper
                  order={currentOrderData.order as Order}
                  clientSecret={currentOrderData.clientSecret}
                  stripeAccountId={currentOrderData.stripeId}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CheckoutWrapper;
