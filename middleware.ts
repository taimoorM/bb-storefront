import { NextRequest, NextResponse } from "next/server";
import getSubdomain from "./utils/get-subdomain";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  const subdomain = getSubdomain(host as string);
  const requestHeaders = new Headers(req.headers);

  if (req.cookies.get("bb-access-token")) {
    requestHeaders.set(
      "bb-api-key",
      req.cookies.get("bb-access-token")?.value as string
    );
  }

  if (subdomain) {
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
