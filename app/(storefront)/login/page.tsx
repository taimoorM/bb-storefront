import LoginForm from "@/components/Auth/LoginForm";
import React from "react";
import { cookies } from "next/headers";

export default function Page() {
  const cookieStore = cookies();

  return <LoginForm />;
}
