export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-[1280px] mx-auto w-[95%] py-14">{children}</main>
  );
}
