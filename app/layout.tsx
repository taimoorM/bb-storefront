import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { StorefrontProvider } from "@/contexts/storefront";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storefront",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch("http://localhost:3001/api/types");
  const types = await res.json();
  console.log(types);
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Suspense fallback={<p>Loading...</p>}>
          <StorefrontProvider>
            <Navbar types={types} />

            <main>{children}</main>
          </StorefrontProvider>
        </Suspense>
      </body>
    </html>
  );
}
