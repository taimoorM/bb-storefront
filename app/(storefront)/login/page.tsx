import LoginForm from "@/components/Auth/LoginForm";
import React from "react";
import { cookies, headers } from "next/headers";

export default function Page() {
  const headersList = headers();
  const subdomain = headersList.get("bb-subdomain");

  return <LoginForm subdomain={subdomain} />;
}
