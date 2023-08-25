import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AppProvider } from "@/contexts/app";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/providers";

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
          <Providers>
            <AppProvider>
              <Navbar />
              <main className="max-w-[1280px] mx-auto w-[95%]">{children}</main>
              <Toaster />
            </AppProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
