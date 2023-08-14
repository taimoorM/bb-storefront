import Link from "next/link";
import { GridTileImage } from "../Grid/tile";
import Grid from "../Grid";
import { useStore } from "@/contexts/store";

export function ProductGrid() {
  const { inventory } = useStore();
  return (
    <Grid>
      {items.map((item) => (
        <Grid.Item key={item.id} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/item/${item.name}`}
          >
            <GridTileImage
              alt={item.title}
              label={{
                title: item.name,
                amount: item.price,
                currencyCode: item.priceRange.maxVariantPrice.currencyCode,
              }}
              src={item.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </Grid>
  );
}
