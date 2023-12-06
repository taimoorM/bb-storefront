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

interface OrderData {
  order: Order;
  clientSecret: string;
  stripeId: string;
}

function CheckoutWrapper({
  data,
  cart,
  session,
}: {
  data: OrderData | null;
  cart: Cart | undefined;
  session: Session | null;
}) {
  const { cart: storeCart, setCart } = useStore();

  useEffect(() => {
    if (!cart) return;
    setCart(cart);
  }, [cart, setCart]);

  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
    data
  );

  useEffect(() => {
    if (!storeCart) return;
    setCurrentOrderData(null);
  }, [storeCart]);

  const items = data ? data.order.items : cart?.items;

  console.log(items);

  const subTotal = data ? data.order.totals?.subtotal : cart?.subTotal;

  const currentOrder = currentOrderData ? currentOrderData.order : null;
  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>

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
      </div>
    </section>
  );
}

export default CheckoutWrapper;
