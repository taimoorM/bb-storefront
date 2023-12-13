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
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

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

    const res = await fetch(`/api/storefront/session`, {
      headers: {
        "x-secret-key": secretKey,
        "x-api-id": secretKeyId,
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ storeId }),
    });

    if (!res.ok) {
      throw new Error("Could not fetch  new session");
    }

    const data = await res.json();

    return Response.json({
      session: data.session,
      cart: data.cart,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
}
