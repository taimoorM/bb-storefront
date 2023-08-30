"use client";

import { useStore } from "@/contexts/store";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const { headers } = useStore();
  const { data } = useQuery({
    queryKey: ["checkout"],
    queryFn: () => {
      return fetch("api/storefront/checkout", {
        headers,
      }).then((res) => res.json());
    },
  });

  const options = {
    clientSecret: data?.clientSecret as string,
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Elements options={options} stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
