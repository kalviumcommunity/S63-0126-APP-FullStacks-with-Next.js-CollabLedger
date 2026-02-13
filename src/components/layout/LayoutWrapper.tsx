/**
 * LayoutWrapper Component
 * Wraps Header and page content.
 * Provides consistent layout across all routes.
 */
import Header from "./Header";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
