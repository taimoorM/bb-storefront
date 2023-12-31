"use client";
import { useApp } from "@/contexts/app";
import Link from "next/link";
import Logo from "./logo";
import Search from "./search";
import { useStore } from "@/contexts/store";
import { Suspense } from "react";
import OpenCart from "../Cart/OpenCart";
import Cart from "../Cart";
import { usePathname } from "next/navigation";
import UserDropdown from "./user-dropdown";

export default function Navbar() {
  const { metadata } = useApp();
  const { types, categories } = useStore();
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-4">
      <div className="max-w-[1280px] mx-auto w-[95%]">
        <div className="block flex-none md:hidden">
          {/* <MobileMenu menu={menu} /> */}
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/2 items-center relative">
            <Link
              href="/"
              aria-label="Go back home"
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <Logo
                src={metadata?.logo}
                alt={metadata?.businessName as string}
              />
              <div className="ml-2 mr-4 flex-none text-sm font-medium uppercase lg:block">
                {metadata?.businessName}
              </div>
            </Link>
            <div className="flex">
              {types.length ? (
                <div className="relative group">
                  <button className="text-black px-4 py-2 text-sm">
                    Shop by Type
                  </button>

                  <div className="absolute left-0 mt-2 w-48 bg-white p-4 rounded border shadow-lg opacity-0 group-hover:opacity-100 transition ease-in-out duration-150 z-50">
                    <ul className="hidden gap-6 text-sm md:block">
                      {types.map((type) => (
                        <li key={type.id}>
                          <Link
                            href={`type/${type.id}`}
                            className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                          >
                            {type.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
              {categories.length ? (
                <div className="relative group">
                  <button className=" text-black px-4 py-2 text-sm">
                    Shop by Category
                  </button>

                  <div className="absolute left-0 mt-2 w-48 bg-white p-4 rounded border shadow-lg opacity-0 group-hover:opacity-100 transition ease-in-out duration-150 z-50">
                    <ul className="hidden gap-6 text-sm md:block ">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`categories/${category.name}`}
                            className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="hidden justify-center md:flex md:w-1/3">
            <Search />
          </div>

          <div className="flex justify-end md:w-1/3">
            {pathname !== "/cart" ? (
              <div className="flex gap-2">
                <UserDropdown />
                <Suspense fallback={<OpenCart />}>
                  <Cart />
                </Suspense>
              </div>
            ) : (
              <Link href="/">Back to Shop</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
