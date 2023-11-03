"use client";

import { GridTileImage } from "../Grid/tile";
import Grid from "../Grid";
import { useStore } from "@/contexts/store";
import { useApp } from "@/contexts/app";
import placeHolderImage from "@/public/product-placeholder.webp";

export function ProductGrid() {
  const { inventory, selectedStore } = useStore();

  if (!inventory) {
    return null;
  }

  return (
    <Grid className="grid-cols-4">
      {inventory.map((item, i) => {
        const primaryImage = item.images.find((image) => image.isPrimary)?.path;

        console.log("primaryImage", primaryImage);

        const imagePath = primaryImage
          ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${primaryImage}`
          : placeHolderImage;
        return (
          <Grid.Item key={item.id} className="animate-fadeIn">
            <GridTileImage
              alt={item.name}
              variants={item.variants}
              label={{
                title: item.name,
                currencyCode: selectedStore.currency || "USD",
              }}
              src={imagePath}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Grid.Item>
        );
      })}
    </Grid>
  );
}
