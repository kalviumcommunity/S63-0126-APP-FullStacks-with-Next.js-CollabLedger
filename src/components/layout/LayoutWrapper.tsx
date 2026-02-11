/**
 * LayoutWrapper Component
 * Wraps Header, Sidebar, and page content.
 * Provides consistent flex layout and spacing across all routes.
 */
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
