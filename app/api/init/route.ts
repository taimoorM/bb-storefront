import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  console.log("GET /api/init");

  const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();
  const cookieStore = cookies();

  try {
    const accessToken = cookieStore.get(`bb-access-token`);

    const query = supabase
      .from("Customer")
      .select("id, businessName, subdomain, logo, publicKey, stripeId");

    if (accessToken?.value) {
      query.eq("publicKey", accessToken.value);
    }

    const { data, error } = await query.eq("subdomain", subdomain).single();

    if (error) {
      throw error;
    }

    console.log(data);

    if (!data) {
      return NextResponse.json(
        { error: "No subdomain found" },
        { status: 400 }
      );
    }

    const { data: stores, error: storeError } = await supabase
      .from("Store")
      .select("id, name, address, phone, currency")
      .eq("customerId", data.id);

    if (!stores || !stores.length) {
      return NextResponse.json("No stores found", { status: 400 });
    }

    if (storeError) {
      throw storeError;
    }

    if (!accessToken) {
      cookies().set({
        name: `bb-access-token`,
        value: data.publicKey,
        path: "/",
        httpOnly: true,
      });
    }
    return NextResponse.json({ stores, metadata: data });
  } catch (e: any) {
    console.log(e);

    if (e.code === "PGRST116") {
      return NextResponse.json("No subdomain found", { status: 404 });
    }
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
