import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { StorefrontProvider } from "@/contexts/storefront";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
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
            <p>HELOSAD</p>
            <main>{children}</main>
          </StorefrontProvider>
        </Suspense>
      </body>
    </html>
  );
}
