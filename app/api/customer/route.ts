import { auth } from "@/auth";
import { supabase } from "@/libs/supabase";
import getBusiness from "@/utils/get-business";
import { cookies } from "next/headers";

export const GET = auth(async (req) => {
  try {
    if (!req.auth) {
      return new Response("Unauthorized", { status: 401 });
    }

    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const subdomain = req.headers.get("bb-subdomain")?.toLowerCase();

    const business = await getBusiness(subdomain, publicKey?.value);

    const { secretKey, secretKeyId } = business;

    const response = await fetch(
      `http://localhost:3000/api/storefront/sudo/customers?id=${req.auth.user.id}`,
      {
        headers: {
          "x-secret-key": secretKey,
          "x-api-id": secretKeyId,
          Accept: "application/json",
        },
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error("Could not fetch customer");
    }

    const customer = await response.json();

    return Response.json({
      customer,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
});
