"use client";

import { useStore } from "@/contexts/store";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/Checkout/CheckoutForm";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const { headers } = useStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("api/storefront/checkout", {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
  const { data } = useQuery({
    queryKey: ["checkout"],
    queryFn: () => {
      return fetch("api/storefront/checkout", {
        headers,
      });
    },
  });

  const options = {
    clientSecret,
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
