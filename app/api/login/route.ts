import { auth, signIn } from "@/auth";
import { supabase } from "@/libs/supabase";

import { Cart, Customer, Session } from "@/types/types";
import getBusiness from "@/utils/get-business";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = auth(async (req) => {
  try {
    if (!req.auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const business = await getBusiness(subdomain, publicKey?.value);

    const { secretKey, secretKeyId } = business;

    const response = await fetch(
      "http://localhost:3000/api/storefront/sudo/session",
      {
        headers: {
          "x-secret-key": secretKey,
          "x-api-id": secretKeyId,
          Accept: "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          customerId: req.auth.user.id,
          token: token?.value || "",
          action: "connect",
        }),
      }
    );

    console.log(response);
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
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
});
