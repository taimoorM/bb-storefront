"use client";

import { useStore } from "@/contexts/store";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const { headers } = useStore();
  const { data } = useQuery({
    queryKey: ["checkout"],
    queryFn: () => {
      return fetch("api/storefront/checkout", {
        headers,
      });
    },
  });

  return (
    <div>
      <h1>Checkout</h1>
    </div>
  );
}
``;
