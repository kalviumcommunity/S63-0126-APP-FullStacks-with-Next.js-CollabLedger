/**
 * Sidebar Component
 * Left navigation panel with link list.
 * Semantic <aside>, keyboard accessible.
 */
import Link from "next/link";

const sidebarLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/login", label: "Log In" },
  { href: "/signup", label: "Sign Up" },
];

export default function Sidebar() {
  return (
    <aside
      className="w-56 shrink-0 border-r border-black/10 bg-neutral-50 p-4"
      aria-label="Sidebar navigation"
    >
      <nav aria-label="Sidebar links">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-inset"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
