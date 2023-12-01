import LoginForm from "@/components/Auth/LoginForm";
import React from "react";
import { cookies } from "next/headers";

export default function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session");
  return <LoginForm sessionToken={sessionToken?.value as string} />;
}
