"use client";
import { Cart, CartItem, Order, OrderItem } from "@/types/types";
import Image from "next/image";
import Price from "../Price";
import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";

interface OrderProductListProps {
  items: CartItem[] | OrderItem[];
}

function OrderProductList({ items }: OrderProductListProps) {
  const { selectedStore } = useStore();
  return (
    <ul className="mb-5 space-y-3">
      {items.map((item: OrderItem | CartItem) => (
        <li key={item.id} className="flex items-center">
          <div className="relative h-20 w-20 rounded-xl border shadow-sm">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${
                item.image as string
              }`}
              fill
              className="object-contain rounded-xl"
              alt={item.title}
            />
            <div className="absolute flex items-center text-xs justify-center w-4 h-4 rounded-full bg-blue-500 text-white right-0 top-[-5px]">
              {item.quantity}
            </div>
          </div>

          <div className="flex flex-col justify-center ml-2">
            <p className="font-semibold">{item.title}</p>
            <p className="text-slate-800 text-sm">{item.subtitle}</p>
          </div>
          <Price
            className="ml-auto text-right"
            amount={item.price * item.quantity}
            currencyCode={selectedStore?.currency}
          />
        </li>
      ))}
    </ul>
  );
}
export default OrderProductList;
