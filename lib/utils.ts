import { Cart, Inventory, InventoryMap } from "@/types/types";
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

// export function getItemDetailsById(inventory: Inventory, itemId: string) {
//   const item = inventory?.find((item) => item.id === itemId);

//   if (item) {
//     return {
//       name: item.name,
//       sizeLabel: item.sizeLabel,
//       image: item.images[0]?.path,
//       quantity: item.quantity,
//     };
//   }
//   return null;
// }
