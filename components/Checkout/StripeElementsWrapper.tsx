import { Elements } from "@stripe/react-stripe-js";
import CheckoutPaymentForm from "./CheckoutPaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Order } from "@/types/types";

interface StripeElementsWrapperProps {
  clientSecret: string;
  order: Order;
  stripeAccountId: string;
}

export default function StripeElementsWrapper({
  clientSecret,
  order,
  stripeAccountId,
}: StripeElementsWrapperProps) {
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
      <p className="text-lg font-bold mb-3">Payment Details</p>
      <CheckoutPaymentForm
        orderId={order.id}
        stripeAccountId={stripeAccountId}
      />
    </Elements>
  );
}
