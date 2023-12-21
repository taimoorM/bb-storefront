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
import CheckoutLogin from "./CheckoutLogin";

export interface OrderData {
  order: Order;
  clientSecret: string;
  stripeId: string;
}

function CheckoutWrapper({
  token,
  headers,
  session,
}: {
  token: string | undefined;
  headers: HeadersInit;
  session: Session | null;
}) {
  const router = useRouter();
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState<
    OrderData | undefined
  >(undefined);

  const { data, error, isFetched } = useQuery<OrderData>({
    queryKey: ["order"],
    queryFn: async () => fetchOrder(token as string, headers),
    retry: false,
  });

  console.log("ORDER DATA", data);

  console.log("ORDER ERROR", error);

  const {
    data: cart,
    error: cartError,
    isFetched: cartIsFetched,
  } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => fetchCart(token as string, headers),
    enabled: !error,
  });

  if ((cartIsFetched && cartError) || (cartIsFetched && !cart?.items.length)) {
    router.push("/cart");
  }

  useEffect(() => {
    if (data) {
      setCurrentOrderData(data);
    }
  }, [data]);

  console.log(currentOrderData);

  const items = data ? data.order.items : cart?.items;
  const subTotal = data ? data.order.totals.subtotal : cart?.subtotal;
  const currentOrder = currentOrderData ? currentOrderData.order : null;

  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>
        <div className="p-4">
          {!isFetched || (error && !cartIsFetched) ? (
            <Spinner />
          ) : (
            <>
              {!session && !isGuestCheckout && (!data || error) ? (
                <CheckoutLogin setIsGuest={setIsGuestCheckout} />
              ) : (
                <div className="grid  grid-cols-1 md:grid-cols-5 py-4 gap-5">
                  <div className="md:col-span-3 flex flex-col gap-5">
                    <CheckoutDetailsForm
                      setOrderData={setCurrentOrderData}
                      initialData={currentOrder}
                    />
                    {currentOrderData && (
                      <div className="border border-1 rounded-lg p-4">
                        <StripeElementsWrapper
                          order={currentOrderData.order as Order}
                          clientSecret={currentOrderData.clientSecret}
                          stripeAccountId={currentOrderData.stripeId}
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 order-first w-full border  border-1 rounded-lg p-4   md:border-none md:order-last">
                    <OrderProductList
                      items={items as OrderItem[] | CartItem[]}
                    />
                    <CheckoutTotals
                      subTotal={subTotal as number}
                      totals={
                        currentOrderData ? currentOrderData.order.totals : null
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CheckoutWrapper;
