"use client";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useStore } from "@/contexts/store";
import { useEffect } from "react";

export default function CheckoutSuccess() {
  const { setCart, cart } = useStore();

  useEffect(() => {
    if (!cart) return;
    const cartCopy = { ...cart };

    cartCopy.items = [];

    setCart(cartCopy);
  }, [setCart, cart]);
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
