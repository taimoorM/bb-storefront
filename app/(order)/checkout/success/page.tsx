import CheckoutSuccess from "@/components/Checkout/CheckoutSuccess";
import { Button, buttonVariants } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const publicKey = cookieStore.get("bb-access-token");
  const token = cookieStore.get("session");
  const paymentIntentId = searchParams.payment_intent as string;

  const res = await fetch(`http:localhost:3000/api/storefront/checkout`, {
    method: "PATCH",
    headers: {
      "x-public-key": publicKey?.value || "",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentIntentId,
      token: token?.value,
    }),
  });

  if (res.ok) {
    return <CheckoutSuccess />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-lg mb-6">
        There was problem processing your order, please try again on contact us
        if the problem persists.
      </p>
      <Link href="/cart" className={buttonVariants()}>
        Go to Cart
      </Link>
    </div>
  );
}
