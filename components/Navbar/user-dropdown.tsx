import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiaUser } from "react-icons/Lia";
import { useStore } from "@/contexts/store";
import LogoutButton from "../Auth/LogoutButton";
import { LogOutIcon } from "lucide-react";
import { useSession } from "next-auth/react";

function UserDropdown() {
  const { customer } = useStore();
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
          <LiaUser className="h-4 transition-all ease-in-out hover:scale-110 " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {session && customer ? (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{customer.firstName}</DropdownMenuItem>
            <DropdownMenuItem>{customer.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex gap-2">
                <LogoutButton />
              </div>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            <p className="text-sm font-bold">Not logged in</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
