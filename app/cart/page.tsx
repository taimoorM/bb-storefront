import CartItemList from "@/components/Cart/CartItemList";
import CartTotal from "@/components/Cart/CartTotal";

export default function CartPage() {
  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h1 className="md:text-2xl lg:text-3xl pb-5 border-b">Shopping Cart</h1>

        <CartItemList />
        <CartTotal />
      </div>
    </section>
  );
}
