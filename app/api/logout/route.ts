import { auth, signOut } from "@/auth";
import logOutCustomer from "@/utils/logout-customer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  console.log("logout");
  try {
    if (!req.auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const redirect = searchParams.get("redirect");
    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    console.log("token", subdomain);

    const response = await logOutCustomer({
      publicKey: publicKey?.value as string,
      token: token?.value as string,
      subdomain,
    });

    console.log(req.url);

    console.log(response);

    if (!response.ok) {
      throw new Error("Could not log out customer");
    }

    await signOut({
      redirect: false,
    });

    const url = new URL("/login", `http://${subdomain}.localhost:4000`);

    return NextResponse.redirect(url);
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
});
