import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-12">
          <h1 className="text-9xl font-bold bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse">
            404
          </h1>
          <div className="flex justify-center gap-3 mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">🌍</span>
            </div>
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 -mt-4">
              <span className="text-5xl">🔍</span>
            </div>
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">❓</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-emerald-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Oops! The page you&apos;re looking for seems to have wandered off on
            its own mission. Let&apos;s get you back to making an impact.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-xl font-semibold inline-flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="px-8 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              <span>🌱</span>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard"
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold text-gray-900">Dashboard</p>
          </Link>
          <Link
            href="/about"
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">ℹ️</div>
            <p className="text-sm font-semibold text-gray-900">About</p>
          </Link>
          <Link
            href="/login"
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">🔐</div>
            <p className="text-sm font-semibold text-gray-900">Login</p>
          </Link>
          <Link
            href="/signup"
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm font-semibold text-gray-900">Sign Up</p>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-sm text-gray-500">
          Need help? The CollabLedger community is here to support your NGO
          journey.
        </p>
      </div>
    </div>
  );
}
