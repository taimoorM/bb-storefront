import StripeElementsWrapper from "@/components/Checkout/StripeElementsWrapper";
import Price from "@/components/Price";
import getQueryClient from "@/getQueryClient";
import { OrderItem } from "@/types/types";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session");
  const publicKey = cookieStore.get("bb-access-token");

  const res = await fetch(
    `http:localhost:3000/api/storefront/checkout?token=${token?.value}`,
    {
      headers: {
        "x-public-key": publicKey?.value || "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  console.log(data);

  return (
    <section className="border border-1 rounded">
      <div className="p-4 lg:p-6">
        <h1 className="md:text-2xl lg:text-3xl pb-5 border-b">Checkout</h1>

        <div className="grid grid-cols-3 py-4">
          <div className="col-span-2">
            <ul>
              {data.order.items.map((item: OrderItem) => (
                <li key={item.id} className="flex">
                  <div className="relative h-20 w-20 rounded-xl border shadow-sm">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${
                        item.images[0].path as string
                      }`}
                      layout="fill"
                      className="object-fit"
                      alt={item.name}
                    />
                    <div className="absolute flex items-center text-xs justify-center w-4 h-4 rounded-full bg-blue-500 text-white right-0 top-[-5px]">
                      {item.quantity}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center ml-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-slate-800 text-sm">{item.sizeLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1">
            <StripeElementsWrapper
              order={data.order}
              clientSecret={data.clientSecret}
              stripeAccountId={data.stripeId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
