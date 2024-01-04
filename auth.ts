import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { supabase } from "./libs/supabase";

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
        subdomain: { type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials.password ||
          !credentials.subdomain
        ) {
          return null;
        }

        const publicKey = cookies().get("bb-access-token");

        const { data: business, error } = await supabase
          .from("Business")
          .select("id, subdomain, secretKey, secretKeyId")
          .eq("subdomain", credentials.subdomain)
          .eq("publicKey", publicKey?.value || "")
          .single();

        if (error || !business) {
          return null;
        }

        const { secretKey, secretKeyId } = business;

        const res = await fetch(
          `http://localhost:3000/api/storefront/sudo/customers?action=authenticate`,
          {
            headers: {
              "x-secret-key": secretKey,
              "x-api-id": secretKeyId,
              Accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        console.log(res);

        if (!res.ok) {
          return null;
        }
        const customer = await res.json();

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
    jwt: ({ token, user, trigger }) => {
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
