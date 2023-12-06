import { auth } from "@/auth";
import CheckoutWrapper from "@/components/Checkout/CheckoutWrapper";
import { Cart, Order } from "@/types/types";
import { Session } from "next-auth/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session");
  const publicKey = cookieStore.get("bb-access-token");

  const headers = {
    "x-public-key": publicKey?.value || "",
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["order"],
    queryFn: async () => {
      fetch(
        `http:localhost:3000/api/storefront/checkout?token=${token?.value}`,
        {
          headers,
        }
      );
    },
  });

  let order: Order | undefined;
  let cart: Cart | undefined;
  let data: {
    order: Order;
    clientSecret: string;
    stripeId: string;
  } | null = null;
  let session: Session | null = null;

  // try {
  //   session = await auth();
  //   const res = await fetch(
  //     `http:localhost:3000/api/storefront/checkout?token=${token?.value}`,
  //     {
  //       headers,
  //       cache: "no-cache",
  //     }
  //   );

  //   if (!res.ok) {
  //     if (res.status === 404) {
  //       const cartRes = await fetch(
  //         `http:localhost:3000/api/storefront/cart?token=${token?.value}`,
  //         {
  //           headers,
  //           next: {
  //             tags: ["cart"],
  //           },
  //         }
  //       );

  //       if (!cartRes.ok) {
  //         throw new Error("Could not fetch cart");
  //       }
  //       cart = await cartRes.json();
  //     } else {
  //       throw new Error(`Unexpected server response: ${res.statusText}`);
  //     }
  //   } else {
  //     data = await res.json();
  //     order = data?.order;
  //   }
  // } catch (e) {
  //   console.log(e);
  //   redirect("/cart");
  // }

  return <CheckoutWrapper data={data} cart={cart} session={session} />;
}
