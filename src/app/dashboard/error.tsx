"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

/**
 * Error boundary for the dashboard page.
 * Displays a user-friendly error message with retry functionality.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-neutral-100 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Error Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Oops! Dashboard Error
          </h1>
          <p className="text-center text-gray-600 mb-6">
            We encountered an unexpected error while loading your dashboard.
            Please try again or go back to the home page.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-mono text-red-700 wrap-break-word">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>

          {/* Support Message */}
          <p className="text-center text-sm text-gray-500 mt-6">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
