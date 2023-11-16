import CheckoutDetailsForm from "@/components/Checkout/CheckoutDetailsForm";
import CheckoutTotals from "@/components/Checkout/CheckoutTotals";
import OrderProductList from "@/components/Checkout/OrderProductList";
import Price from "@/components/Price";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
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
  try {
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
      order = await res.json();
    }
  } catch (e) {
    console.log(e);
    redirect("/cart");
  }

  const items = cart ? cart.items : order?.items;
  const subTotal = cart ? cart.subTotal : order?.totals.subtotal;

  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h2>

        <div className="grid grid-cols-5 py-4 gap-5">
          <div className="col-span-3">
            <CheckoutDetailsForm />
          </div>
          <div className="col-span-2">
            <OrderProductList items={items as OrderItem[] | CartItem[]} />

            <CheckoutTotals
              subTotal={subTotal as number}
              totals={order ? order.totals : null}
            />
            {/* <StripeElementsWrapper
              order={data.order}
              clientSecret={data.clientSecret}
              stripeAccountId={data.stripeId}
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
