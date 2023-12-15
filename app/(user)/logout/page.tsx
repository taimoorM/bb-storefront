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

  const callBackUrl = searchParams.call_back_url as string;

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
