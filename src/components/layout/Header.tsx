/**
 * Header Component
 * Top navigation bar with logo, nav links, and CTAs.
 * Semantic <header>, responsive, accessible.
 */
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Team" },
  { href: "/products", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header
      className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur"
      role="banner"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-black hover:text-black/80"
          aria-label="CollabLedger home"
        >
          <img
            src="/collabledger-logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
            aria-hidden
          />
          <span>CollabLedger</span>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black hover:text-black/70 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="rounded-full border border-black px-4 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
