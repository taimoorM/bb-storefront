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
    if (!cookieStore.has(`${subdomain}-access-token`)) {
      const { data, error } = await supabase
        .from("Customer")
        .select()
        .eq("subdomain", subdomain);

      if (error) {
        throw error;
      }

      if (!data.length) {
        return NextResponse.json(
          { error: "No subdomain found" },
          { status: 400 }
        );
      }

      cookies().set({
        name: `${subdomain}-access-token`,
        value: data[0].publicKey,
        path: "/",
        httpOnly: true,
      });

      return NextResponse.json({ data: data[0] });
    }

    const accessToken = cookieStore.get(`${subdomain}-access-token`);

    const { data, error } = await supabase
      .from("Customer")
      .select("id, businessName, subdomain, logo")
      .eq("subdomain", subdomain)
      .eq("publicKey", accessToken);

    if (error) throw error;

    if (!data.length) {
      return NextResponse.json(
        { error: "Bad Request" },
        { status: 400, statusText: "Bad Request" }
      );
    }
    console.log(data[0]);

    return NextResponse.json({ data: data[0] });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
