"use client";

import clsx from "clsx";
import { AiOutlinePlus } from "react-icons/Ai";

import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";
import { InventoryItem, Variant } from "@/types/types";
import { useTransition } from "react";
import LoadingDots from "../LoadingDots";

export function AddToCart({
  item,
  name,
  className,
}: {
  item: Variant;
  name: string;
  className?: string;
}) {
  const { metadata } = useApp();
  const { session, cart, useUpdateCart } = useStore();
  console.log("session", session);

  const cartItem = cart?.items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const title = !item.quantity ? "Out of stock" : name;

  console.log("seesion", session);

  const updateCart = useUpdateCart(session?.id as string, item.id, "add", {
    "x-public-key": metadata?.publicKey || "",
    Accept: "application/json",
  });

  return (
    <button
      aria-label="Add item to cart"
      disabled={
        updateCart.isLoading || !item.quantity || quantity >= item.quantity
      }
      title={title}
      onClick={() => {
        // Safeguard in case someone messes with `disabled` in devtools.
        if (!item.quantity) return;
        updateCart.mutate();
      }}
      className={clsx(
        `flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90 relative ${className}`,
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
