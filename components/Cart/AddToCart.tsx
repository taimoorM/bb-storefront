"use client";

import { AiOutlinePlus } from "react-icons/Ai";
import clsx from "clsx";

import LoadingDots from "../LoadingDots";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { InventoryItem } from "@/types/types";
import { useUpdateCart } from "@/utils/fetch-queries";
import { useMutation } from "@tanstack/react-query";
import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";
import { headers } from "next/headers";

export function AddToCart({ item }: { item: InventoryItem }) {
  const { metadata } = useApp();
  const { session, cart, useUpdateCart } = useStore();
  const [isPending, startTransition] = useTransition();

  const cartItem = cart?.items.find((i) => i.id === item.id);

  const title = !item.quantity ? "Out of stock" : item.name;

  const updateCart = useUpdateCart(session?.id as string, item.id, "add", {
    "x-public-key": metadata?.publicKey || "",
    Accept: "application/json",
  });

  return (
    <button
      aria-label="Add item to cart"
      disabled={updateCart.isLoading || !item.quantity}
      title={title}
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!item.quantity) return;
        updateCart.mutate();
      }}
      className={clsx(
        "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90",
        {
          "cursor-not-allowed opacity-60 hover:opacity-60":
            !item.quantity || updateCart.isLoading,
          "cursor-not-allowed": updateCart.isLoading,
        }
      )}
    >
      <div className="absolute left-0 ml-4">
        {!updateCart.isLoading ? (
          <AiOutlinePlus className="h-5" />
        ) : (
          <LoadingDots className="mb-3 bg-white" />
        )}
      </div>
      <span>{item.quantity ? "Add To Cart" : "Out Of Stock"}</span>
    </button>
  );
}
