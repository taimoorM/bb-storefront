import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("GET /api/init");

  const subdomain = req.headers.get("bb-subdomain");
  console.log("subdomain", subdomain);

  try {
  } catch (e) {}
}
