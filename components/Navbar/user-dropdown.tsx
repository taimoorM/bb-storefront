import { Popover, PopoverTrigger } from "../ui/popover";
import { LiaUser } from "react-icons/Lia";

function UserDropdown() {
  const user = null;
  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
          <LiaUser className="h-4 transition-all ease-in-out hover:scale-110 " />
        </div>
      </PopoverTrigger>
    </Popover>
  );
}

export default UserDropdown;
