/**
 * Header Component
 * Purple navigation bar with ExScore theme
 * Appears on all pages
 */
import Link from "next/link";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-white text-xl font-bold">CollabLedger</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="/#home" className="text-green-400 font-semibold hover:text-green-300 transition">HOME</a>
            <a href="/#about" className="text-white hover:text-green-400 transition">ABOUT US</a>
            <Link href="/dashboard" className="text-white hover:text-green-400 transition">DASHBOARD</Link>
            <a href="/#projects" className="text-white hover:text-green-400 transition">PROJECTS</a>
            <a href="/#contact" className="text-white hover:text-green-400 transition">CONTACT</a>
          </div>
          <Link
            href="/signup"
            className="bg-green-400 hover:bg-green-500 text-purple-900 font-semibold px-6 py-2 rounded-full transition shadow-lg"
          >
            Support Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
