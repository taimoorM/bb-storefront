"use client";
import { useStore } from "@/contexts/store";
import Price from "../Price";
import { useApp } from "@/contexts/app";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revalidate_tag } from "@/app/actions";

export default function CartTotal() {
  const { cart } = useStore();
  const { stores } = useApp();
  const router = useRouter();
  const queryClient = useQueryClient();

  const pathname = usePathname();

  let currencyCode = "USD";

  if (localStorage.getItem("bb-selected-store")) {
    const store = localStorage.getItem("bb-selected-store");
    const selectedStore = stores.find((s) => s.id === store);
    if (selectedStore) currencyCode = selectedStore.currency;
  }

  const handleProceedToCheckout = () => {
    router.push(`/checkout`);
  };

  return (
    <>
      <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
        {/* <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
              <p>Taxes</p>
              <Price
                className="text-right text-base text-black dark:text-white"
                amount={cart?.subTotal ? cart.subTotal * 0.1 : 0}
                currencyCode={currencyCode}
              />
            </div> */}
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Shipping</p>
          <p className="text-right">Calculated at checkout</p>
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Total</p>
          <Price
            className="text-right text-base text-black dark:text-white"
            amount={cart?.subtotal || 0}
            currencyCode={currencyCode}
          />
        </div>
      </div>

      {pathname !== "/cart" && (
        <Link
          href={"/cart"}
          className="block w-full rounded-full bg-slate-800 p-3  mb-2 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
        >
          Go to Cart
        </Link>
      )}

      <button
        onClick={handleProceedToCheckout}
        className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
      >
        Proceed to Checkout
      </button>
    </>
  );
}
