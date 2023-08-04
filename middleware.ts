import { NextRequest, NextResponse } from "next/server";
import getSubdomain from "./utils/get-subdomain";

export async function middleware(req: NextRequest) {
  const referer = req.headers.get("referer");
  console.log(referer);

  const subdomain = getSubdomain(referer as string);
  console.log(subdomain);

  if (subdomain) {
    console.log("subdomain", subdomain);
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
