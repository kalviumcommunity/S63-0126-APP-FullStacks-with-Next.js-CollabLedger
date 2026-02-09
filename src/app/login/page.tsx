"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();

  // Debug log: Page Mount
  if (typeof window !== "undefined") {
    console.log("[LOGIN] mounted");
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("[LOGIN] form state before submit:", formData);

    // Client-side validation
    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    console.log("[LOGIN] loading:", true);

    try {
      console.log("[LOGIN] sending request to /api/auth/login");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent/received
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("[LOGIN] response status:", response.status);
      console.log(
        "[LOGIN] response headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("[LOGIN] response body:", data);

      if (!response.ok) {
        console.error("[LOGIN ERROR] API error:", data.message);
        setError(data.message || "Login failed");
        return;
      }

      // Backend sets HTTP-only cookie, no need to manually store anything
      console.log("[LOGIN] \u2705 Login successful!");
      console.log("[LOGIN] \u27a1\ufe0f Redirecting to /dashboard in 100ms...");

      // Small delay to ensure cookie is set before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to dashboard on success
      console.log("[LOGIN] \ud83d\ude80 Navigating to dashboard now");
      router.push("/dashboard");
    } catch (err) {
      console.error("[LOGIN ERROR] Network/System error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      console.log("[LOGIN] loading:", false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center bg-gray-900 overflow-hidden">
      {/* Background Image Container - Full Screen with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/image.png')" }}
      >
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Container - Aligned Left */}
      <div
        className={`relative z-10 w-full min-h-screen flex items-center justify-start px-4 sm:px-8 md:px-16 lg:px-24 ${inter.className}`}
      >
        {/* Glassmorphism Logic Card - Increased size and padding */}
        <div className="w-full max-w-xl p-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-3 text-base text-green-100/90 leading-relaxed">
              Sign in to continue to CollabLedger
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-green-50 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3.5 bg-white/5 border border-white/10 placeholder-green-200/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all text-base"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    console.log("[LOGIN] email updated:", e.target.value);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-green-50 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3.5 bg-white/5 border border-white/10 placeholder-green-200/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all text-base"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    console.log(
                      "[LOGIN] password updated (length):",
                      e.target.value.length
                    );
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg shadow-green-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-green-100/70">
                New to the platform?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-green-300 hover:text-white transition-colors ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
