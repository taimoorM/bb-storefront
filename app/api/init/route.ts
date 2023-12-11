import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  console.log("GET /api/init");

  const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();
  const cookieStore = cookies();

  try {
    const accessToken = cookieStore.get(`bb-access-token`);
    const session = cookieStore.get(`session`);

    const query = supabase
      .from("Business")
      .select(
        "id, businessName, subdomain, logo, publicKey, stripeId, secretKey, secretKeyId"
      );

    if (accessToken) {
      query.eq("publicKey", accessToken.value);
    }

    const { data, error } = await query.eq("subdomain", subdomain).single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "No subdomain found" },
        { status: 400 }
      );
    }

    const { data: stores, error: storeError } = await supabase
      .from("Store")
      .select("id, name, address, phone, currency")
      .eq("businessId", data.id);

    if (!stores || !stores.length) {
      return NextResponse.json("No stores found", { status: 400 });
    }

    if (storeError) {
      throw storeError;
    }

    if (!accessToken?.value) {
      cookies().set({
        name: `bb-access-token`,
        value: data.publicKey,
        path: "/",
        httpOnly: true,
      });
    }

    if (req.auth && session) {
    }
    return NextResponse.json({ stores, metadata: data });
  } catch (e: any) {
    console.log(e);

    if (e.code === "PGRST116") {
      return NextResponse.json("No subdomain found", { status: 404 });
    }
    return NextResponse.json({ error: e }, { status: 500 });
  }
});
