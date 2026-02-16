"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

/**
 * Error boundary for the project details page.
 * Displays a user-friendly error message with retry and back navigation.
 */
export default function ProjectDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Project Details Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Error Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200 max-w-lg">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Project Not Found
          </h1>
          <p className="text-center text-gray-600 mb-6">
            We encountered an error loading this project. It may have been
            deleted, or you might not have permission to view it.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-mono text-red-700 break-word">
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
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Dashboard
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
