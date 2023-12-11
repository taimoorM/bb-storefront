import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { deleteCookie } from "@/app/actions";
import { fetchSession } from "@/utils/fetch-queries";
import { useStore } from "@/contexts/store";
import { useApp } from "@/contexts/app";

export default function LogoutButton() {
  const { setCustomer } = useApp();
  const { selectedStore, headers, setCart, setSession } = useStore();
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      await deleteCookie("session");
      const { session, cart, customer } = await fetchSession(
        selectedStore.id,
        headers
      );

      setSession(session);
      setCart(cart);
      setCustomer(customer);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button onClick={handleSignOut} variant="ghost">
      Logout
    </Button>
  );
}
