import { auth, signOut } from "@/auth";
import logOutCustomer from "@/utils/logout-customer";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("logout");
  try {
    const searchParams = req.nextUrl.searchParams;
    const redirect = searchParams.get("redirect");
    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const response = await logOutCustomer({
      publicKey: publicKey?.value as string,
      token: token?.value as string,
      subdomain,
      redirect,
    });

    console.log(req.url);

    if (!response.ok) {
      throw new Error("Could not log out customer");
    }

    await signOut({
      redirect: false,
    });

    cookies().delete("next-auth.session-token");

    return NextResponse.redirect(
      new URL(redirect || "/login", `http://${subdomain}.localhost:4000`)
    );
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}
