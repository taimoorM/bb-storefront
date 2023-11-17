"use client";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
import CheckoutDetailsForm from "./CheckoutDetailsForm";
import CheckoutTotals from "./CheckoutTotals";
import OrderProductList from "./OrderProductList";
import { useState } from "react";
import { Label } from "../ui/label";
import StripeElementsWrapper from "./StripeElementsWrapper";

type OrderData = {
  order: Order;
  clientSecret: string;
  stripeId: string;
};

function CheckoutWrapper({
  data,
  order,
  cart,
}: {
  data: OrderData | null;
  order: Order | undefined;
  cart: Cart | undefined;
}) {
  const items = cart ? cart.items : order?.items;

  const subTotal = cart ? cart.subTotal : order?.totals?.subtotal;

  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(
    data
  );

  console.log(currentOrderData);
  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>

        <div className="grid grid-cols-5 py-4 gap-5">
          <div className="col-span-3">
            {currentOrderData ? (
              <div className="space-y-2">
                <div className="border border-1 rounded-xl p-4">
                  <h4 className="text-lg font-bold mb-3">Billing Details</h4>
                  <Label>Email</Label>
                  <p>{currentOrderData.order.email}</p>
                  <Label>Phone</Label>
                  <p>{currentOrderData.order.billing.phone}</p>
                  <Label>Address</Label>
                  <address>
                    {currentOrderData.order.billing.address.line1}
                    {currentOrderData.order.billing.address.line2 &&
                      currentOrderData.order.billing.address.line2}
                    <br />
                    {currentOrderData.order.billing.address.city},{" "}
                    {currentOrderData.order.billing.address.state}{" "}
                    {currentOrderData.order.billing.address.postalCode}
                  </address>
                </div>

                <div className="border border-1 rounded-xl p-4">
                  <h4 className="text-lg font-bold mb-3">Shipping Details</h4>
                  {currentOrderData.order.shipping.name ? (
                    <div>
                      <Label>Name</Label>
                      <p>{currentOrderData.order.shipping.name}</p>
                      <Label>Phone</Label>
                      <p>{currentOrderData.order.shipping.phone}</p>
                      <Label>Address</Label>
                      <address>
                        {currentOrderData.order.shipping.address.line1}
                        {currentOrderData.order.shipping.address.line2 &&
                          currentOrderData.order.shipping.address.line2}
                        <br />
                        {currentOrderData.order.shipping.address.city},{" "}
                        {currentOrderData.order.shipping.address.state}{" "}
                        {currentOrderData.order.shipping.address.postalCode}
                      </address>
                    </div>
                  ) : (
                    <p>No shipping details provided.</p>
                  )}
                </div>
              </div>
            ) : (
              <CheckoutDetailsForm setOrderData={setCurrentOrderData} />
            )}
          </div>
          <div className="col-span-2">
            <OrderProductList items={items as OrderItem[] | CartItem[]} />

            <CheckoutTotals
              subTotal={subTotal as number}
              totals={order ? order.totals : null}
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
