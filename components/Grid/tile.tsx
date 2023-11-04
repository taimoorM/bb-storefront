"use client";
import clsx from "clsx";
import Image from "next/image";
import Label from "../Label";
import { Inventory, InventoryItem, Variant } from "@/types/types";
import React, { useState } from "react";
import { AddToCart } from "../Cart/AddToCart";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  variants,
  ...props
}: {
  isInteractive?: boolean;

  active?: boolean;
  variants: Variant[];
  label?: {
    title: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <div className="h-full group flex flex-col">
      <div
        className={clsx(
          "flex flex-col h-full w-full items-center justify-center overflow-hidden rounded-lg border border-b-0 rounded-b-none bg-white hover:border-blue-600 dark:bg-black aspect-square",
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
        <div className="z-10 flex flex-col gap-2">
          {variants.map((variant, i) => (
            <React.Fragment key={variant.id}>
              {" "}
              <button
                aria-disabled={!variant.quantity}
                disabled={!variant.quantity}
                onClick={() => {
                  setSelectedVariant(i);
                }}
                title={`${variant.values
                  .map((value) => value.label)
                  .join(" ")} ${!variant.quantity ? "(Out of Stock)" : ""}`}
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
                {variant.values.map((value) => value.label).join(" | ")}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
      <AddToCart
        item={variants[selectedVariant]}
        name={label?.title as string}
        className="rounded-lg rounded-t-none border border-b-0"
      />
    </div>
  );
}
