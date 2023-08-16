import { AiOutlineClose } from "react-icons/Ai";
import LoadingDots from "../LoadingDots";
import { useRouter } from "next/navigation";

import clsx from "clsx";

import { useTransition } from "react";
import { CartItem } from "@/types/types";

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => {
        console.log("item", item);
      }}
      disabled={isPending}
      className={clsx(
        "ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200",
        {
          "cursor-not-allowed px-0": isPending,
        }
      )}
    >
      {isPending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <AiOutlineClose className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  );
}
