import CartItemList from "@/components/Cart/CartItemList";

export default function CartPage() {
  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h2 className="md:text-2xl lg:text-3xl pb-5 border-b">Shopping Cart</h2>
        <CartItemList />
      </div>
    </section>
  );
}
