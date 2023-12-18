import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/contexts/store";
import { LiaUser } from "react-icons/Lia";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function UserDropdown() {
  const { customer } = useStore();
  const { data: session } = useSession();

  const pathname = usePathname();
  console.log("pathname", pathname);

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
              <Link
                href={`/api/logout?redirect=${pathname}`}
                className="w-full"
              >
                Logout
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hello, Guest</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/login" className="w-full">
                Login
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
