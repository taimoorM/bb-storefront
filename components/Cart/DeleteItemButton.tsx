import { AiOutlineClose } from "react-icons/Ai";
import LoadingDots from "../LoadingDots";

import clsx from "clsx";

import { useStore } from "@/contexts/store";
import { CartItem } from "@/types/types";

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const { session, cart, useUpdateCart, headers } = useStore();
  const removeItemFromCart = useUpdateCart(
    session?.token as string,
    item.id,
    "remove",
    headers
  );

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!item.quantity) return;
        removeItemFromCart.mutate();
      }}
      disabled={removeItemFromCart.isPending}
      className={clsx(
        "ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200",
        {
          "cursor-not-allowed px-0": removeItemFromCart.isPending,
        }
      )}
    >
      {removeItemFromCart.isPending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <AiOutlineClose className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  );
}
