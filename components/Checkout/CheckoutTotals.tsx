"use client";
import { useStore } from "@/contexts/store";
import Price from "../Price";

function CheckoutTotals({
  subTotal,
  totals,
}: {
  subTotal: number;
  totals: {
    subtotal: number;
    taxAmount: number;
    total: number;
  } | null;
}) {
  const { selectedStore } = useStore();
  const currencyCode = selectedStore?.currency;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <p>Subtotal</p>

        <Price
          className="text-right text-base text-black dark:text-white"
          amount={subTotal as number}
          currencyCode={currencyCode}
        />
      </div>
      {totals && (
        <>
          <div className="mb-2 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
            <p className="text-sm font-light">Tax</p>
            <Price
              className="text-right text-black dark:text-white text-sm font-light"
              amount={totals.taxAmount}
              currencyCode={currencyCode}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Total</p>

            <Price
              className="text-right text-base text-black dark:text-white font-semibold"
              amount={totals.total}
              currencyCode={currencyCode}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CheckoutTotals;
