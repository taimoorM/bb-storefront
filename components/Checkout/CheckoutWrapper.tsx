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

interface OrderData {
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

  const { data, error, isFetched } = useQuery<OrderData>({
    queryKey: ["order"],
    queryFn: async () => fetchOrder(token as string, headers),
    retry: false,
  });

  console.log(data);

  console.log(error);

  const {
    data: cart,
    error: cartError,
    isFetched: cartIsFetched,
  } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => fetchCart(token as string, headers),
    enabled: !!error,
  });

  if (cartError) {
    router.push("/cart");
  }

  const [currentOrderData, setCurrentOrderData] = useState<
    OrderData | undefined
  >(undefined);

  useEffect(() => {
    if (data) {
      setCurrentOrderData(data);
    }
  }, [data]);

  console.log(currentOrderData);

  const items = data ? data.order.items : cart?.items;
  const subTotal = data ? data.order.totals.subtotal : cart?.subTotal;
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
              {!session && !isGuestCheckout ? (
                <CheckoutLogin setIsGuest={setIsGuestCheckout} />
              ) : (
                <div className="grid grid-cols-5 py-4 gap-5">
                  <div className="col-span-3">
                    <CheckoutDetailsForm
                      setOrderData={setCurrentOrderData}
                      initialData={currentOrder}
                    />
                    {currentOrderData && (
                      <StripeElementsWrapper
                        order={currentOrderData.order as Order}
                        clientSecret={currentOrderData.clientSecret}
                        stripeAccountId={currentOrderData.stripeId}
                      />
                    )}
                  </div>
                  <div className="col-span-2">
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
