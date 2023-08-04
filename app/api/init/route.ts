import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("GET /api/init");

  const subdomain = req.headers.get("bb-subdomain")?.toLocaleLowerCase();

  try {
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

    console.log("data", data);
  } catch (e) {
    console.log(e);
    NextResponse.json({ error: e }, { status: 500 });
  }
}
