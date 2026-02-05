/**
 * Authorization Middleware
 *
 * Intercepts all incoming requests and:
 * 1. Validates JWT tokens from Authorization headers
 * 2. Enforces role-based access control
 * 3. Attaches user context to request headers for downstream handlers
 *
 * Protects routes:
 * - /api/admin/* - Admin-only routes
 * - /api/users - Authenticated users only
 * - /api/projects - Authenticated users only
 * - /api/tasks - Authenticated users only
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT, extractTokenFromHeader } from "@/lib/auth";
import { sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

/**
 * Define which routes are protected and their role requirements
 */
const PROTECTED_ROUTES = [
  {
    pattern: /^\/api\/admin/,
    requireRole: "ADMIN",
    description: "Admin-only routes",
  },
  {
    pattern: /^\/api\/users/,
    requireRole: null, // Authenticated users only
    description: "User management routes",
  },
  {
    pattern: /^\/api\/projects/,
    requireRole: null, // Authenticated users only
    description: "Project management routes",
  },
  {
    pattern: /^\/api\/tasks/,
    requireRole: null, // Authenticated users only
    description: "Task management routes",
  },
];

/**
 * Routes that bypass middleware (public routes)
 */
const PUBLIC_ROUTES = [
  /^\/api\/auth\/login/,
  /^\/api\/auth\/signup/,
  /^\/api\/health/,
  /^\/api\/prisma-test/, // For testing purposes
];

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((pattern) => pattern.test(pathname));
}

/**
 * Find matching protected route configuration
 */
function findProtectedRoute(
  pathname: string
): (typeof PROTECTED_ROUTES)[number] | null {
  return PROTECTED_ROUTES.find((route) => route.pattern.test(pathname)) || null;
}

/**
 * Main middleware function
 * Runs for all incoming requests to the application
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if route is protected
  const protectedRoute = findProtectedRoute(pathname);

  if (!protectedRoute) {
    // Route is not in protected routes list, allow it
    return NextResponse.next();
  }

  // Extract token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      sendError(
        "Authorization token is missing",
        ERROR_CODES.UNAUTHORIZED,
        401
      ),
      { status: 401 }
    );
  }

  // Verify JWT token
  let decoded;
  try {
    decoded = verifyJWT(token);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid token";
    const status = errorMessage === "TOKEN_EXPIRED" ? 401 : 403;
    const code =
      errorMessage === "TOKEN_EXPIRED"
        ? ERROR_CODES.TOKEN_EXPIRED
        : ERROR_CODES.INVALID_TOKEN;

    return NextResponse.json(sendError(errorMessage, code, status), {
      status,
    });
  }

  // Enforce role-based access control
  if (
    protectedRoute.requireRole &&
    decoded.role !== protectedRoute.requireRole
  ) {
    return NextResponse.json(
      sendError(
        `Access denied. This route requires ${protectedRoute.requireRole} role.`,
        ERROR_CODES.FORBIDDEN,
        403
      ),
      { status: 403 }
    );
  }

  // Attach user context to request headers for downstream handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", decoded.id);
  requestHeaders.set("x-user-email", decoded.email);
  requestHeaders.set("x-user-role", decoded.role);

  // Continue to the route handler with enhanced request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes the middleware should run on
 * Matches pattern: /api/* (all API routes)
 * Excludes: static files, images, etc.
 */
export const config = {
  matcher: ["/api/:path*"],
};
