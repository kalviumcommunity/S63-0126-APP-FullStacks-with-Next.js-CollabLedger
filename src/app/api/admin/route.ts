/**
 * Admin-Only Routes
 *
 * These routes are protected by middleware and only accessible to users with ADMIN role.
 * Middleware automatically blocks non-admin requests with 403 Forbidden response.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractUserFromHeaders } from "@/lib/auth";
import { sendSuccess } from "@/lib/responseHandler";

export async function GET(req: NextRequest) {
  // User context is guaranteed to be available here
  // Middleware has already verified JWT and role
  const user = extractUserFromHeaders(req);

  return NextResponse.json(
    sendSuccess(
      {
        message: "Welcome to admin panel! You have full access.",
        user: {
          id: user?.id,
          email: user?.email,
          role: user?.role,
        },
        adminCapabilities: [
          "View all users",
          "Manage user roles and permissions",
          "View system analytics",
          "Access audit logs",
          "Manage system settings",
        ],
      },
      "Admin access granted"
    ),
    { status: 200 }
  );
}
