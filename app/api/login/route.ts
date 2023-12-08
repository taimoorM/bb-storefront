import { auth, signIn } from "@/auth";

import { Cart, Customer, Session } from "@/types/types";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const res = await signIn("credentials", {
      email,
      password,
      subdomain,
      redirect: false,
    });

    console.log(res);

    // const response = await fetch(
    //   "http://localhost:3000/api/storefront/session",
    //   {
    //     headers: {
    //       "x-public-key": publicKey?.value || "",
    //       Accept: "application/json",
    //     },
    //     method: "PATCH",
    //     body: JSON.stringify({
    //       customerId: req.auth.user.id,
    //       token: token?.value || "",
    //     }),
    //   }
    // );
    // if (!response.ok) {
    //   throw new Error("Could not create checkout session");
    // }

    // const {
    //   session,
    //   customer,
    //   cart,
    // }: { session: Session; customer: Customer; cart: Cart } =
    //   await response.json();

    // cookies().set("session", session.token, {
    //   expires: new Date(session.expiresAt),
    //   path: "/",
    // });

    // return Response.json({
    //   session,
    //   customer,
    //   cart,
    // });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}
