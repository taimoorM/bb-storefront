import { Cart } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCartQuantityTotal(cart: Cart) {
  return cart?.items?.reduce((acc: number, item: any) => {
    return acc + item.quantity;
  }, 0);
}
