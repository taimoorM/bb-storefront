import { supabase } from "@/libs/supabase";
import { cookies } from "next/headers";
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
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const response = await fetch(
      `http://localhost:3000/api/storefront/session?token=${token?.value}`,
      {
        headers: {
          "x-public-key": publicKey?.value || "",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok || !token?.value) {
      const { data: business, error } = await supabase
        .from("Business")
        .select("id, subdomain, secretKey, secretKeyId")
        .eq("subdomain", subdomain)
        .eq("publicKey", publicKey?.value || "")
        .single();

      if (error || !business) {
        throw new Error("Could not find business");
      }

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

      console.log("res", res);

      if (!res.ok) {
        throw new Error("Could not fetch  new session");
      }

      const data = await res.json();

      return Response.json({
        session: data.session,
        cart: data.cart,
      });
    }

    const data = await response.json();
    console.log("data", data);
    return Response.json({
      session: data.session,
      cart: data.cart,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
}
