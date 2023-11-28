"use client";
import { useApp } from "@/contexts/app";
import clsx from "clsx";

export default function StoreSelect({
  onSelect,
  selectedStore,
}: {
  onSelect: (store: string) => void;
  selectedStore: string | null;
}) {
  const { stores } = useApp();
  console.log("stores", stores);
  return (
    <div
      className={clsx(
        "absolute items-center justify-center h-screen w-full bg-gray-800 z-20",
        {
          hidden: selectedStore,
          flex: !selectedStore,
        }
      )}
    >
      <div className="flex justify-center flex-col">
        <h2 className="text-2xl font-bold mb-5">Select your store:</h2>
        <ul className="flex gap-5">
          {stores.map((store) => (
            <li key={store.id}>
              <button
                className="border border-1 rounded p-4 hover:bg-gray-700 transition-colors"
                onClick={() => {
                  onSelect(store.id);
                }}
              >
                <h3> {store.name}</h3>
                <p className="text-sm font-bold">{store.address.line1}</p>
                <p className="text-sm">{store.address.city}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
