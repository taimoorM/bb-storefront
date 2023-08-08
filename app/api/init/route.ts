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

      const token = jwt.sign(
        {
          data: data[0].publicKey,
        },
        process.env.JWT_SECRET as string
      );

      cookies().set({
        name: `${subdomain}-access-token`,
        value: token,
        path: "/",
        httpOnly: true,
      });

      return NextResponse.json({ data: data[0] });
    }

    const publicKey = jwt.verify(
      accessToken?.value as string,
      process.env.JWT_SECRET as string
    );
    console.log("publicKey", publicKey);
    const { data, error } = await supabase
      .from("Customer")
      .select()
      .eq("subdomain", subdomain)
      .eq("publicKey", publicKey?.data);

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
