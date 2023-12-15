"use server";
import getBusiness from "./get-business";

interface params {
  subdomain: string | undefined;
  publicKey: string | undefined;
  token: string;
  callbackUrl?: string | null;
}

export default async function logOutCustomer(params: params) {
  const { subdomain, publicKey, token, callbackUrl } = params;
  const business = await getBusiness(subdomain, publicKey);

  const { secretKey, secretKeyId } = business;

  const requestHeaders = new Headers();
  requestHeaders.set("x-secret-key", secretKey);
  requestHeaders.set("x-api-id", secretKeyId);
  requestHeaders.set("Accept", "application/json");
  requestHeaders.set("x-middleware-subrequest", undefined);

  // requestHeaders.set("user-agent", "Chrome");

  const response = await fetch(
    "http://localhost:3000/api/storefront/sudo/session",
    {
      headers: requestHeaders,
      method: "PATCH",
      body: JSON.stringify({
        token,
        action: "disconnect",
      }),
    }
  );

  console.log(response);

  // if (response.ok) {
  //   await signOut({
  //     redirect: false,
  //   });
  //   cookies().delete("session");
  //   if (callbackUrl) {
  //     redirect(callbackUrl);
  //   } else {
  //     redirect("/login");
  //   }
  // }
}
