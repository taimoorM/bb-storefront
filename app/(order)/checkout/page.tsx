import OrderProductList from "@/components/Checkout/OrderProductList";
import StripeElementsWrapper from "@/components/Checkout/StripeElementsWrapper";
import Price from "@/components/Price";
import getQueryClient from "@/getQueryClient";
import { Order, OrderItem } from "@/types/types";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session");
  const publicKey = cookieStore.get("bb-access-token");

  const res = await fetch(
    `http:localhost:3000/api/storefront/checkout?token=${token?.value}`,
    {
      headers: {
        "x-public-key": publicKey?.value || "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    redirect("/");
  }

  const data: { order: Order; clientSecret: string; stripeId: string } =
    await res.json();
  console.log(data);

  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>

        <div className="grid grid-cols-5 py-4">
          <div className="col-span-3"></div>
          <div className="col-span-2">
            <OrderProductList order={data.order} />

            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p>Subtotal</p>

                <Price
                  className="text-right text-base text-black dark:text-white"
                  amount={data.order.totals.subtotal}
                  currencyCode={data.order.currency}
                />
              </div>
              <div className="mb-2 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p className="text-sm font-light">Tax</p>
                <Price
                  className="text-right text-black dark:text-white text-sm font-light"
                  amount={data.order.totals.taxAmount}
                  currencyCode={data.order.currency}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold">Total</p>

                <Price
                  className="text-right text-base text-black dark:text-white font-semibold"
                  amount={data.order.totals.total}
                  currencyCode={data.order.currency}
                />
              </div>
            </div>
            <StripeElementsWrapper
              order={data.order}
              clientSecret={data.clientSecret}
              stripeAccountId={data.stripeId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}