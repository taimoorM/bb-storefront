"use server";

import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
  cookies().delete(name);
}

export async function setCookie(
  name: string,
  value: string,
  options: {
    expires: Date;
    path: string;
  }
) {
  cookies().set(name, value, options);
}
