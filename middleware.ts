import { NextRequest, NextResponse } from "next/server";
import getSubdomain from "./utils/get-subdomain";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  const subdomain = getSubdomain(host as string);

  if (subdomain) {
    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("bb-subdomain", subdomain);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.json({ error: "No subdomain found" }, { status: 400 });
}

export const config = {
  matcher: ["/:path*"],
};
