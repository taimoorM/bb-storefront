"use client";
import { useStorefront } from "@/contexts/storefront";
import Link from "next/link";

interface IProps {
  types: {
    id: string;
    label: string;
  }[];
}

export default function Navbar({ types }: IProps) {
  const { storefront, isLoading } = useStorefront();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      {isLoading && !storefront ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="block flex-none md:hidden">
            {/* <MobileMenu menu={menu} /> */}
          </div>
          <div className="flex w-full items-center">
            <div className="flex w-full md:w-1/3">
              <Link
                href="/"
                aria-label="Go back home"
                className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
              >
                <div className="ml-2 flex-none text-sm font-medium uppercase text-white lg:block">
                  {storefront?.businessName}
                </div>
              </Link>
              {types.length ? (
                <ul className="hidden gap-6 text-sm md:flex md:items-center">
                  {types.map((type) => (
                    <li key={type.id}>
                      <Link
                        href={type.id}
                        className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                      >
                        {type.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {/* <div className="hidden justify-center md:flex md:w-1/3">
          <Search />
        </div>
        <div className="flex justify-end md:w-1/3">
          <Suspense fallback={<OpenCart />}>
            <Cart />
          </Suspense>
        </div> */}
          </div>
        </>
      )}
    </nav>
  );
}
