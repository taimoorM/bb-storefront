"use client";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
import CheckoutDetailsForm from "./CheckoutDetailsForm";
import CheckoutTotals from "./CheckoutTotals";
import OrderProductList from "./OrderProductList";
import { useState } from "react";
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
  order,
  cart,
  session,
}: {
  data: OrderData | null;
  order: Order | undefined;
  cart: Cart | undefined;
  session: Session | null;
}) {
  const { customer } = useStore();

  const items = cart ? cart.items : order?.items;

  const subTotal = cart ? cart.subTotal : order?.totals?.subtotal;

  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
    data
  );

  const [editMode, setEditMode] = useState<"billing" | "shipping" | null>(null);

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
              customer={session ? customer : null}
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
