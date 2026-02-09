/**
 * Authorization Middleware
 *
 * Intercepts all incoming requests and:
 * 1. Checks token presence for protected API routes (Edge-safe presence check)
 * 2. Checks token presence in cookies for protected page routes (Edge-safe presence check)
 *
 * Note: Middleware runs in the Edge runtime. To keep this production-safe and
 * compatible, we do NOT perform full JWT signature verification or RBAC checks
 * here. Full JWT verification + role enforcement happens inside API route
 * handlers (Node.js runtime).
 *
 * Protects API routes:
 * - /api/admin/* - Admin-only routes
 * - /api/users - Authenticated users only
 * - /api/projects - Authenticated users only
 * - /api/tasks - Authenticated users only
 *
 * Protects page routes:
 * - /dashboard - Authenticated users only (cookie presence check)
 * - /projects/* - Authenticated users only (cookie presence check)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractTokenFromHeader } from "@/lib/auth";
import { sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

/**
 * Define which API routes are protected and their role requirements
 */
const PROTECTED_API_ROUTES = [
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
 * Define which page routes are protected
 */
const PROTECTED_PAGE_ROUTES = [
  /^\/dashboard/,
  /^\/projects\/.+/, // Dynamic routes like /projects/[id]
];

/**
 * API routes that bypass middleware (public API routes)
 */
const PUBLIC_API_ROUTES = [
  /^\/api\/auth\/login/,
  /^\/api\/auth\/signup/,
  /^\/api\/health/,
  /^\/api\/prisma-test/, // For testing purposes
];

/**
 * Page routes that are public (no auth required)
 */
const PUBLIC_PAGE_ROUTES = [
  /^\/$/, // Home page
  /^\/login/,
  /^\/signup/,
  /^\/about/,
  /^\/products/,
];

/**
 * Check if a route is a public API route
 */
function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((pattern) => pattern.test(pathname));
}

/**
 * Check if a route is a public page route
 */
function isPublicPageRoute(pathname: string): boolean {
  return PUBLIC_PAGE_ROUTES.some((pattern) => pattern.test(pathname));
}

/**
 * Check if a route is a protected page route
 */
function isProtectedPageRoute(pathname: string): boolean {
  return PROTECTED_PAGE_ROUTES.some((pattern) => pattern.test(pathname));
}

/**
 * Find matching protected API route configuration
 */
function findProtectedApiRoute(
  pathname: string
): (typeof PROTECTED_API_ROUTES)[number] | null {
  return (
    PROTECTED_API_ROUTES.find((route) => route.pattern.test(pathname)) || null
  );
}

/**
 * Extract JWT token from cookie (for page routes)
 */
function getTokenFromCookie(req: NextRequest): string | null {
  // Read HTTP-only token cookie set by backend
  return req.cookies.get("token")?.value || null;
}

/**
 * Main middleware function
 * Runs for all incoming requests to the application
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    return handleApiRoute(req);
  }

  // Handle page routes
  return handlePageRoute(req);
}

/**
 * Handle API route protection
 *
 * Note: Middleware runs in Edge runtime and cannot use Node.js crypto modules.
 * Therefore, we only check for token PRESENCE, not signature verification.
 * Full JWT verification happens in the API route handlers (Node runtime).
 */
function handleApiRoute(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public API routes without authentication
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if route is protected
  const protectedRoute = findProtectedApiRoute(pathname);

  if (!protectedRoute) {
    // Route is not in protected routes list, allow it
    return NextResponse.next();
  }

  // Extract token from Authorization header OR cookie
  const authHeader = req.headers.get("authorization");
  let token = extractTokenFromHeader(authHeader);

  // If no Authorization header, try cookie (for browser fetch calls)
  if (!token) {
    token = req.cookies.get("token")?.value || null;
  }

  if (!token) {
    return sendError(
      "Authorization token is missing",
      ERROR_CODES.UNAUTHORIZED,
      401
    );
  }

  return NextResponse.next();
}

/**
 * Handle page route protection
 *
 * Note: Middleware runs in Edge runtime and cannot use Node.js crypto modules.
 * Therefore, we only check for cookie PRESENCE, not signature verification.
 * Full JWT verification happens in API routes (Node runtime).
 */
function handlePageRoute(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public page routes
  if (isPublicPageRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if this is a protected page route
  if (!isProtectedPageRoute(pathname)) {
    // Not explicitly protected, allow it
    return NextResponse.next();
  }

  // Protected page route - check for auth token in cookie
  const token = getTokenFromCookie(req);

  if (!token) {
    // No token found - redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - allow access
  // Note: We don't verify signature here (Edge runtime limitation)
  // API routes will verify the token when data is fetched
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * Matches:
 * - /api/* (all API routes)
 * - /dashboard (protected page)
 * - /projects/* (protected dynamic routes)
 * Excludes: static files, images, _next, favicon
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).)*",
  ],
};
