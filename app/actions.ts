"use server";

import { cookies } from "next/headers";
import { signIn, signOut } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";

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

export async function login(email: string, password: string) {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  console.log("res", res);
}

export async function revalidate_tag(tag: string) {
  revalidateTag(tag);
}

export async function revalidate_path(path: string) {
  revalidatePath(path);
}

export async function logout() {
  "use server";
  await signOut();
}
