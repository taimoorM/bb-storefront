"use client";
import { cookies } from "next/headers";
import CartModal from "./CartModal";
import { useStore } from "@/contexts/store";

export default function Cart() {
  const { cart } = useStore();
  return <CartModal cart={cart} />;
}
