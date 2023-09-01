import StripeElementsWrapper from "@/components/Checkout/StripeElementsWrapper";
import getQueryClient from "@/getQueryClient";
import { cookies } from "next/headers";

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session");
  const publicKey = cookieStore.get("bb-access-token");

  const queryClient = getQueryClient();

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

  const data = await res.json();
  console.log(data);

  return (
    <div>
      <h1>Checkout</h1>
      <StripeElementsWrapper />
    </div>
  );
}
