import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import LoginForm from "../Auth/LoginForm";
import { useApp } from "@/contexts/app";

export default function CheckoutLogin({
  setIsGuest,
}: {
  setIsGuest: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Button
        variant="outline"
        className="w-[360px]"
        onClick={() => setIsGuest(true)}
      >
        Continue as guest
      </Button>
      <Separator className="my-4" />
      <LoginForm />
    </div>
  );
}
