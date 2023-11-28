import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/Ai";

import clsx from "clsx";

import LoadingDots from "../LoadingDots";
import { CartItem } from "@/types/types";

import { useStore } from "@/contexts/store";

export default function EditItemQuantityButton({
  item,
  type,
  isLoading,
  setIsLoading,
}: {
  item: CartItem;
  type: "add" | "subtract";
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) {
  const { session, useUpdateCart, headers } = useStore();

  const AddOrSubtractItemFromCart = useUpdateCart(
    session?.id as string,
    item.id,
    type,
    headers
  );
  useEffect(() => {
    setIsLoading(AddOrSubtractItemFromCart.isLoading);
  }, [AddOrSubtractItemFromCart.isLoading, setIsLoading]);

  return (
    <button
      aria-label={
        type === "add" ? "Increase item quantity" : "Reduce item quantity"
      }
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!item.quantity) return;
        AddOrSubtractItemFromCart.mutate();
      }}
      disabled={isLoading}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "cursor-not-allowed": isLoading,
        }
      )}
    >
      {type === "add" ? (
        <AiOutlinePlus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <AiOutlineMinus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
