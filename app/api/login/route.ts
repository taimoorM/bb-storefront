import { auth } from "@/auth";
import { Cart, Customer, Session } from "@/types/types";

import { cookies } from "next/headers";

export const GET = auth(async (req) => {
  try {
    if (!req.auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");

    const response = await fetch(
      "http://localhost:3000/api/storefront/session",
      {
        headers: {
          "x-public-key": publicKey?.value || "",
          Accept: "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          customerId: req.auth.user.id,
          token: token?.value || "",
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Could not create checkout session");
    }

    const {
      session,
      customer,
      cart,
    }: { session: Session; customer: Customer; cart: Cart } =
      await response.json();

    cookies().set("session", session.token, {
      expires: new Date(session.expiresAt),
      path: "/",
    });

    return Response.json({
      session,
      customer,
      cart,
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
});
