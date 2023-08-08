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
    const accessToken = cookieStore.get(`${subdomain}-access-token`);

    if (!accessToken) {
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

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);

      const token = jwt.sign(
        {
          exp: Math.floor(expiry.getTime() / 1000),
          data: data.publicKey,
        },
        process.env.JWT_SECRET as string
      );

      cookies().set({
        name: `${subdomain}-access-token`,
        value: token,
        path: "/",
        httpOnly: true,
        expires: expiry,
      });
    }

    const { data, error } = await supabase
      .from("Customer")
      .select()
      .eq("subdomain", subdomain)
      .eq("publicKey", accessToken);

    if (error) throw error;

    if (!data.length) {
      return NextResponse.json(
        { error: "Bad Request" },
        { status: 400, statusText: "Bad Request" }
      );
    }

    return NextResponse.json({ data: data[0] });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
