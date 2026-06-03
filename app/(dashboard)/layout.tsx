import StoreProvider from "@/store/provider";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[var(--color-page-bg)] text-foreground antialiased">
        {children}
      </div>
    </StoreProvider>
  );
}
