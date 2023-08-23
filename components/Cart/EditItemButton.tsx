import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/Ai";

import clsx from "clsx";

import LoadingDots from "../LoadingDots";
import { CartItem } from "@/types/types";
import { useUpdateCart } from "@/utils/fetch-queries";
import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";

export default function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const { metadata } = useApp();
  const { session, cart, useUpdateCart, headers } = useStore();
  const cartItem = cart?.items.find((i) => i.id === item.id);

  const AddItemToCart = useUpdateCart(
    session?.id as string,
    {
      id: item.id,
      quantity: cartItem?.quantity ? cartItem.quantity + 1 : 1,
    },
    headers
  );
  const SubtractItemFromCart = useUpdateCart(
    session?.id as string,
    {
      id: item.id,
      quantity: cartItem?.quantity ? cartItem.quantity - 1 : 0,
    },
    headers
  );
  return (
    <button
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!item.quantity) return;
        if (type === "plus") {
          AddItemToCart.mutate();
        } else if (type === "minus") {
          SubtractItemFromCart.mutate();
        }
      }}
      disabled={AddItemToCart.isLoading || SubtractItemFromCart.isLoading}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "cursor-not-allowed":
            AddItemToCart.isLoading || SubtractItemFromCart.isLoading,
          "ml-auto": type === "minus",
        }
      )}
    >
      {AddItemToCart.isLoading || SubtractItemFromCart.isLoading ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === "plus" ? (
        <AiOutlinePlus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <AiOutlineMinus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
