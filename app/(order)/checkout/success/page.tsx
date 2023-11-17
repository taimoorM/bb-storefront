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
    }),
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
      <p className="text-lg mb-6">
        We appreciate your business! If you have any questions, please contact
        us.
      </p>
      <Link href="/" className={buttonVariants()}>
        Continue Shopping
      </Link>
    </div>
  );
}
