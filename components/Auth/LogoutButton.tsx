import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { deleteCookie } from "@/app/actions";
import { fetchSession } from "@/utils/fetch-queries";
import { useStore } from "@/contexts/store";

export default function LogoutButton() {
  const { selectedStore, headers } = useStore();
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    deleteCookie("session");
    const data = await fetchSession(selectedStore.id, headers);
    console.log("data", data);
  };
  return (
    <Button onClick={handleSignOut} variant="ghost">
      Logout
    </Button>
  );
}
