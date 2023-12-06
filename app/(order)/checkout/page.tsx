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
import { fetchOrder } from "@/utils/fetch-queries";

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
    queryFn: async () => fetchOrder(token?.value as string, headers),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutWrapper token={token?.value} headers={headers} />
    </HydrationBoundary>
  );
}
