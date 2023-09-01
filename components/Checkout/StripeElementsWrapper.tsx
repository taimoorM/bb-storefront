"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function StripeElementsWrapper() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const options = {
    clientSecret: "client_secret",
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default StripeElementsWrapper;
