import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { deleteCookie } from "@/app/actions";
import { fetchSession } from "@/utils/fetch-queries";
import { useStore } from "@/contexts/store";
import { useApp } from "@/contexts/app";

export default function LogoutButton() {
  const { setCart, setSession, setCustomer } = useStore();
  const handleSignOut = async () => {};
  return (
    <Button onClick={handleSignOut} variant="ghost">
      Logout
    </Button>
  );
}
