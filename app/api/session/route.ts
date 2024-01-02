import { supabase } from "@/libs/supabase";
import getBusiness from "@/utils/get-business";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      throw new Error("No storeId found");
    }

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const headersStore = headers();
    const subdomain = headersStore.get("bb-subdomain")?.toLowerCase();

    console.log("token", token?.value);

    const response = await fetch(
      `http://localhost:3000/api/storefront/session?token=${token?.value}`,
      {
        headers: {
          "x-public-key": publicKey?.value || "",
          Accept: "application/json",
        },
      }
    );

    console.log("response", response);

    if (!response.ok) {
      const business = await getBusiness(subdomain, publicKey?.value);
      const { secretKey, secretKeyId } = business;
      const res = await fetch(
        `http://localhost:3000/api/storefront/sudo/session`,
        {
          headers: {
            "x-secret-key": secretKey,
            "x-api-id": secretKeyId,
            Accept: "application/json",
          },
          method: "POST",
          body: JSON.stringify({ storeId }),
        }
      );

      if (!res.ok) {
        throw new Error("Could not fetch  new session");
      }

      const data = await res.json();

      cookies().set({
        name: `session`,
        value: data.session.token,
        path: "/",
        httpOnly: true,
        expires: new Date(data.session.expiresAt),
      });

      return Response.json({
        session: data.session,
        cart: data.cart,
        customer: null,
      });
    }

    const data = await response.json();

    if (data.customer) {
      const business = await getBusiness(subdomain, publicKey?.value);
      const { secretKey, secretKeyId } = business;
      const response = await fetch(
        `http://localhost:3000/api/storefront/sudo/customers?id=${data.customer}`,
        {
          headers: {
            "x-secret-key": secretKey,
            "x-api-id": secretKeyId,
            Accept: "application/json",
          },
        }
      );

      const customer = await response.json();
      return Response.json({
        session: data.session,
        cart: data.cart,
        customer,
      });
    }

    console.log("data", data);
    return Response.json({
      session: data.session,
      cart: data.cart,
      customer: null,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
}
