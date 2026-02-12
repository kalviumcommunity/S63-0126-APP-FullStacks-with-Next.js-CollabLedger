"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/schemas/signupSchema";
const inter = Inter({ subsets: ["latin"] });

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (typeof window !== "undefined") {
    console.log("[SIGNUP] mounted");
  }

  const onSubmit = async (data: SignupFormData) => {
    console.log("[SIGNUP] form state before submit:", {
      ...data,
      password: "***",
      confirmPassword: "***",
    });
    setError("");

    console.log("[SIGNUP] loading:", true);

    try {
      console.log("[SIGNUP] sending request to /api/auth/signup");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent/received
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      console.log("[SIGNUP] response status:", response.status);
      console.log(
        "[SIGNUP] response headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("[SIGNUP] response body:", responseData);

      if (!response.ok) {
        console.error("[SIGNUP ERROR] API error:", responseData.message);
        setError(responseData.message || "Signup failed");
        return;
      }

      // Backend sets HTTP-only cookie, no need to manually store anything
      console.log("[SIGNUP] ✅ Signup successful!");
      console.log("[SIGNUP] ➡️ Redirecting to /dashboard in 100ms...");

      // Small delay to ensure cookie is set before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Redirect to dashboard on success (user is automatically logged in)
      console.log("[SIGNUP] 🚀 Navigating to dashboard now");
      router.push("/dashboard");
    } catch (err) {
      console.error("[SIGNUP ERROR] Network error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      console.log("[SIGNUP] loading:", false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center bg-gray-900 overflow-hidden ${inter.className}`}
    >
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/image2.png')" }}
      >
        {/* Subtle overlay to ensure text readability against any background brightness */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Main Content Container - Aligned Left */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-start px-4 sm:px-8 md:px-16 lg:px-24">
        {/* Glassmorphism Card */}
        <div className="w-full max-w-xl p-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] shadow-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-base text-gray-100/90">
              Join CollabLedger and start making an impact.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm font-medium text-red-100">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-100 mb-1.5 shadow-sm"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-300 text-sm mt-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-100 mb-1.5 shadow-sm"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-100 mb-1.5 shadow-sm"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-100 mb-1.5 shadow-sm"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-transparent text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm mt-1.5">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-100">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-white hover:text-green-300 transition-colors underline decoration-transparent hover:decoration-green-300"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
