import { useApp } from "@/contexts/app";
import { useStore } from "@/contexts/store";
import clsx from "clsx";
import Image from "next/image";

export default function Logo({
  size,
  src,
  alt,
}: {
  src: string | undefined;
  alt: string;
  size?: "sm" | undefined;
}) {
  const { selectedStore } = useStore();
  console.log("src", src);
  console.log("selectedStore", selectedStore);
  return (
    <div
      className={clsx(
        "relative flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
        {
          "h-[40px] w-[40px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        }
      )}
    >
      {src ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${src}`}
          alt={alt}
          fill
          className="object-contain"
        />
      ) : (
        <h1 className="text-2xl font-bold">{selectedStore?.name[0]}</h1>
      )}
    </div>
  );
}
