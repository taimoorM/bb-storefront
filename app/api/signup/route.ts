import getBusiness from "@/utils/get-business";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookiesStore = cookies();
    const publicKey = cookiesStore.get("bb-access-token");
    const headersStore = headers();
    const subdomain = headersStore.get("bb-subdomain")?.toLowerCase();
    const business = await getBusiness(subdomain, publicKey?.value);

    const data = await req.json();
    const response = await fetch(
      "http://localhost:3000/api/storefront/sudo/customers",
      {
        headers: {
          "x-secret-key": business.secretKey,
          "x-api-id": business.secretKeyId,
          Accept: "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Could not create customer");
    }

    const customer = await response.json();
    return Response.json(customer);
  } catch (e: any) {
    console.log(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
