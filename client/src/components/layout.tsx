import { BottomNav } from "./bottom-nav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
