import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const publicKey = cookies().get("bb-access-token");

        const res = await fetch(
          `/api/storefront/customers?email=${credentials.email}&password=${credentials.password}`,
          {
            headers: {
              "x-public-key": publicKey?.value || "",
              Accept: "application/json",
            },
          }
        );
        const customer = await res.json();

        if (
          !customer ||
          !(await compare(credentials.password as string, customer.password))
        ) {
          return null;
        }

        return {
          id: customer.id,
          email: customer.email,
          name: customer.firstName,
        };
      },
    }),
  ],
});
