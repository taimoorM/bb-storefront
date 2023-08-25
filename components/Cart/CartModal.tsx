"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import CloseCart from "./CloseCart";
import OpenCart from "./OpenCart";

import { useStore } from "@/contexts/store";
import { getCartQuantityTotal } from "@/lib/utils";
import CartItemList from "./CartItemList";
import CartTotal from "./CartTotal";

export default function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const { cart } = useStore();

  let totalQuantity = 0;
  if (cart) totalQuantity = getCartQuantityTotal(cart);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              <CartItemList closeCart={closeCart} />
              <CartTotal />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
