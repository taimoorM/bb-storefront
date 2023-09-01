"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Order } from "@/types/types";

interface StripeElementsWrapperProps {
  clientSecret: string;
  order: Order;
  stripeAccountId: string;
}

function StripeElementsWrapper({
  clientSecret,
  order,
  stripeAccountId,
}: StripeElementsWrapperProps) {
  console.log("stripeAccountId", stripeAccountId);
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    {
      stripeAccount: stripeAccountId,
    }
  );

  console.log(order, clientSecret);

  const options = {
    clientSecret,
  };
  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default StripeElementsWrapper;
