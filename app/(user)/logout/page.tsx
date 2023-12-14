import { logout } from "@/app/actions";
import { auth, signOut } from "@/auth";
import getBusiness from "@/utils/get-business";
import { log } from "console";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session) redirect("/login");
  console.log("session", session);

  const callBackUrl = searchParams.call_back_url as string;

  const cookiesStore = cookies();

  const publicKey = cookiesStore.get("bb-access-token");
  const token = cookiesStore.get("session");
  const headersList = headers();
  const subdomain = headersList.get("bb-subdomain")?.toLowerCase();

  if (!subdomain || !publicKey?.value) redirect("/");

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
        customerId: session.user.id,
        token: token?.value || "",
        action: "disconnect",
      }),
    }
  );

  if (response.ok) {
    await logout();
    cookies().delete("session");
    if (callBackUrl) {
      redirect(callBackUrl);
    } else {
      redirect("/login");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong...</h2>
      <p className="text-lg mb-6">
        While logging you out of your account, we encountered an error. Please
        try again.
      </p>
      <Link
        href={callBackUrl ? `/logout?=${callBackUrl}` : "/logout"}
        className="text-lg mb-6"
      >
        Logout
      </Link>
    </div>
  );
}
