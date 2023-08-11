import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { StorefrontProvider } from "@/contexts/storefront";
import { headers } from "next/headers";
import Script from "next/script";
import StoreSelect from "@/components/StoreSelect";

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
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Suspense fallback={<p>Loading...</p>}>
          <StorefrontProvider>
            <Navbar />
            <main>{children}</main>
          </StorefrontProvider>
        </Suspense>
      </body>
    </html>
  );
}
