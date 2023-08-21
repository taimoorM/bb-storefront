"use client";
import clsx from "clsx";
import Image from "next/image";
import Label from "../Label";
import { Inventory, InventoryItem } from "@/types/types";
import { useState } from "react";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  variants,
  setSelectedVariant,
  selectedVariant,

  ...props
}: {
  isInteractive?: boolean;
  setSelectedVariant: (index: number) => void;
  selectedVariant: number;
  active?: boolean;
  variants: InventoryItem[];
  label?: {
    title: string;
    amount: number;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black",
        {
          relative: label,
          "border-2 border-blue-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        }
      )}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={variants[selectedVariant].price}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
      <div className="z-10 flex gap-2 flex-wrap">
        {variants.map((variant, i) => (
          <button
            key={variant.id}
            aria-disabled={!variant.quantity}
            disabled={!variant.quantity}
            onClick={() => {
              setSelectedVariant(i);
            }}
            title={`${variant.sizeLabel} ${variant.size}${
              !variant.quantity ? "(Out of Stock)" : ""
            }`}
            className={clsx(
              "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
              {
                "ring-1 ring-blue-600": selectedVariant === i,
                "transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ":
                  variant.quantity,
                "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                  !variant.quantity,
              }
            )}
          >
            {variant.sizeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
