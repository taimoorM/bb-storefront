import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  console.log("GET /api/init");

  const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();
  const cookieStore = cookies();

  try {
    const accessToken = cookieStore.get(`bb-access-token`);

    const { data, error } = await supabase
      .from("Customer")
      .select("id, businessName, subdomain, logo, publicKey")
      .eq("publicKey", accessToken?.value)
      .eq("subdomain", subdomain)
      .single();

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
      .eq("customerId", data.id);

    if (!stores || !stores.length) {
      return NextResponse.redirect("/404");
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
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
