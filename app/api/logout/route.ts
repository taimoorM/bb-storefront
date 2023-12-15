import { auth } from "@/auth";
import getBusiness from "@/utils/get-business";
import { cookies } from "next/headers";

export const GET = auth(async (req) => {
  console.log("logout");
  try {
    if (!req.auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const token = cookiesStore.get("session");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const business = await getBusiness(subdomain, publicKey?.value);

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

    console.log(response);
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
});
