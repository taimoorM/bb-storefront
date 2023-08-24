import { CartItem } from "@/types/types";
import EditItemQuantityButton from "./EditItemButton";
import { useState } from "react";
import LoadingDots from "../LoadingDots";

export default function EditQuantity({ item }: { item: CartItem }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <EditItemQuantityButton
        item={item}
        type="subtract"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <div className="w-6 text-center flex items-center justify-center">
        {isLoading ? (
          <LoadingDots className="bg-black dark:bg-white" />
        ) : (
          <span className="w-full text-sm">{item.quantity}</span>
        )}
      </div>
      <EditItemQuantityButton
        item={item}
        type="add"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
}
