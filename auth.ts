import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        console.log("publicKey", publicKey);

        const res = await fetch(
          `http://localhost:3000/api/storefront/customers?email=${credentials.email}&password=${credentials.password}`,
          {
            headers: {
              "x-public-key": publicKey?.value || "",
              Accept: "application/json",
            },
          }
        );
        const customer = await res.json();

        console.log("customer", customer);

        if (!customer) {
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
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
  },
});
