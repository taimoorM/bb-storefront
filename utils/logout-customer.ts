import { cookies } from "next/headers";
import getBusiness from "./get-business";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

interface params {
  subdomain: string | undefined;
  publicKey: string | undefined;
  token: string;
  callbackUrl?: string;
}

export default async function logOutCustomer(params: params) {
  const { subdomain, publicKey, token, callbackUrl } = params;
  const business = await getBusiness(subdomain, publicKey);

  const { secretKey, secretKeyId } = business;

  const response = await fetch(
    "http://localhost:3000/api/storefront/sudo/session",
    {
      headers: {
        "x-secret-key": secretKey,
        "x-api-id": secretKeyId,
        Accept: "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        token,
        action: "disconnect",
      }),
    }
  );

  if (response.ok) {
    await signOut({
      redirect: false,
    });
    cookies().delete("session");
    if (callbackUrl) {
      redirect(callbackUrl);
    } else {
      redirect("/login");
    }
  }
}
