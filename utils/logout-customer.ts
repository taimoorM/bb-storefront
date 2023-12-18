"use server";
import { signOut } from "@/auth";
import getBusiness from "./get-business";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logout } from "@/app/actions";

interface params {
  subdomain: string | undefined;
  publicKey: string | undefined;
  token: string;
  redirect: string | null;
}

export default async function logOutCustomer(params: params) {
  const { subdomain, publicKey, token, redirect } = params;
  const business = await getBusiness(subdomain, publicKey);

  const { secretKey, secretKeyId } = business;

  const requestHeaders = new Headers();
  requestHeaders.set("x-secret-key", secretKey);
  requestHeaders.set("x-api-id", secretKeyId);
  requestHeaders.set("Accept", "application/json");

  // requestHeaders.set("user-agent", "Chrome");

  const response = await fetch(
    "http://budbox.req/api/storefront/sudo/session",
    {
      headers: requestHeaders,
      method: "PATCH",
      body: JSON.stringify({
        token,
        action: "disconnect",
      }),
    }
  );

  if (!response.ok) {
    return new Response("Could not log out customer", { status: 500 });
  }

  const newResponse = NextResponse.redirect(
    new URL(redirect || "/login", `http://${subdomain}.localhost:4000`)
  );

  newResponse.cookies.delete("next-auth.session-token");

  console.log(newResponse);

  return newResponse;
}
