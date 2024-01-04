import CustomError from "@/utils/custom-error";
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
      "http://localhost:3000/api/storefront/sudo/customers?action=create",
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

    console.log("response", response);

    if (!response.ok) {
      const error = await response.json();
      console.log("error", error);
      switch (error.code) {
        case "CUSTOMER_EXISTS": {
          throw new CustomError("Customer already exists", error.statusCode);
        }
        default: {
          throw new CustomError("Could not create customer", error.statusCode);
        }
      }
    }

    const customer = await response.json();
    return Response.json(customer);
  } catch (e: any) {
    console.log(e);
    if (e.status) {
      return Response.json("Error signing up", {
        status: e.status,
        statusText: e.message,
      });
    }
    return Response.json({ error: e.message }, { status: 500 });
  }
}
