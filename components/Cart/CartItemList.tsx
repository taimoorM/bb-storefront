"use client";

import DeleteItemButton from "./DeleteItemButton";
import Image from "next/image";
import Price from "../Price";
import EditQuantity from "./EditQuantity";
import { useStore } from "@/contexts/store";
import { useApp } from "@/contexts/app";
import Link from "next/link";
import { LiaShoppingBagSolid } from "react-icons/Lia";
import CartTotal from "./CartTotal";

export default function CartItemList({
  closeCart,
}: {
  closeCart?: () => void;
}) {
  const { cart, inventoryMap, selectedStore } = useStore();

  console.log("cart", cart?.items);

  let currencyCode = "USD";

  if (selectedStore) currencyCode = selectedStore.currency;

  return (
    <>
      {!cart || cart.items.length === 0 ? (
        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <LiaShoppingBagSolid className="h-16" />
          <p className="mt-6 text-center text-2xl font-bold">
            Your cart is empty.
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between overflow-hidden p-1">
          <ul className="flex-grow overflow-auto py-4">
            {cart?.items.map((item, i) => {
              return (
                <li
                  key={item.id}
                  className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                >
                  <div className="relative flex w-full flex-row justify-between px-1 py-4">
                    <div className="absolute z-40 -mt-2 ml-[55px]">
                      <DeleteItemButton item={item} />
                    </div>
                    <Link
                      href={"#"}
                      onClick={closeCart}
                      className="z-30 flex flex-row space-x-4"
                    >
                      <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <Image
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          alt={item.title as string}
                          src={`${
                            process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL
                          }/${item?.image as string}`}
                        />
                      </div>

                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">{item.title}</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.subtitle}
                        </span>
                      </div>
                    </Link>
                    <div className="flex h-16 flex-col justify-between">
                      <Price
                        className="flex justify-end space-y-2 text-right text-sm"
                        amount={item.price}
                        currencyCode={currencyCode}
                      />
                      <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                        <EditQuantity item={item} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <CartTotal />
        </div>
      )}
    </>
  );
}
