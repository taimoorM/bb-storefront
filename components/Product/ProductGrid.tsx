"use client";
import Link from "next/link";
import { GridTileImage } from "../Grid/tile";
import Grid from "../Grid";
import { useStore } from "@/contexts/store";
import { useApp } from "@/contexts/app";
import clsx from "clsx";
import { AddToCart } from "../Cart/AddToCart";
import { useState } from "react";

export function ProductGrid() {
  const { stores } = useApp();
  const { inventory, selectedStore } = useStore();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const store = stores.find((store) => store.id === selectedStore);

  if (!inventory) {
    return null;
  }

  console.log(inventory.items);

  return (
    <Grid className="grid-cols-4">
      {Object.values(inventory.items).map((item, i) => (
        <Grid.Item key={item[0].id} className="animate-fadeIn">
          <GridTileImage
            alt={item[0].name}
            variants={item}
            label={{
              title: item[0].name,
              amount: item[0].price,
              currencyCode: store?.currency || "USD",
            }}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${
              item[0].images[0]?.path || ""
            }`}
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Grid.Item>
      ))}
    </Grid>
  );
}
