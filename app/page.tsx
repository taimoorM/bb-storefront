import { ProductGrid } from "@/components/Product/ProductGrid";

export default async function Home() {
  return (
    <div className="max-w-[1280px] mx-auto">
      <ProductGrid />
    </div>
  );
}
