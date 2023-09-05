import Navbar from "@/components/Navbar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-[1280px] mx-auto w-[95%]">{children}</main>
    </>
  );
}
