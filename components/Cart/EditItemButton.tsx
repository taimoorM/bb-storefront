import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/Ai";

import clsx from "clsx";

import LoadingDots from "../LoadingDots";
import { CartItem } from "@/types/types";
import { useUpdateCart } from "@/utils/fetch-queries";
import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";
import { getItemDetailsById } from "@/lib/utils";

export default function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "add" | "subtract";
}) {
  const { session, cart, useUpdateCart, headers, inventoryMap } = useStore();
  const inventoryItem = getItemDetailsById(inventoryMap, item.id);
  const quantity = inventoryItem?.quantity || 0;

  const AddOrSubtractItemFromCart = useUpdateCart(
    session?.id as string,
    item.id,
    type,
    headers
  );

  const isLoading = AddOrSubtractItemFromCart.isLoading;
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
      disabled={isLoading || (type === "add" && item.quantity >= quantity)}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "cursor-not-allowed": isLoading,
          "ml-auto": type === "subtract",
        }
      )}
    >
      {isLoading ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === "add" ? (
        <AiOutlinePlus className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <AiOutlineMinus className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
