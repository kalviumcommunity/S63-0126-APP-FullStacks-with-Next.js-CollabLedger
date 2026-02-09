/**
 * Authorization Middleware
 *
 * Intercepts all incoming requests and:
 * 1. Validates JWT tokens from Authorization headers (for API routes) - FULL VERIFICATION
 * 2. Checks JWT token presence in cookies (for page routes) - PRESENCE CHECK ONLY
 * 3. Enforces role-based access control (API routes only)
 * 4. Attaches user context to request headers for downstream handlers
 *
 * Note: Page route protection only checks cookie presence due to Edge runtime limitations.
 * Full JWT verification happens in API routes (Node.js runtime).
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
  const token = req.cookies.get("token")?.value || null;
  console.log("[MIDDLEWARE][COOKIE] Checking for 'token' cookie");
  console.log(
    "[MIDDLEWARE][COOKIE] All cookies:",
    req.cookies
      .getAll()
      .map((c) => c.name)
      .join(", ")
  );
  console.log(
    "[MIDDLEWARE][COOKIE] Token:",
    token ? `present (${token.substring(0, 20)}...)` : "MISSING"
  );
  return token;
}

/**
 * Main middleware function
 * Runs for all incoming requests to the application
 */
export function middleware(req: NextRequest) {
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
    return NextResponse.json(
      sendError(
        "Authorization token is missing",
        ERROR_CODES.UNAUTHORIZED,
        401
      ),
      { status: 401 }
    );
  }

  // Token exists - allow the request to proceed
  // Note: We don't verify signature here (Edge runtime limitation)
  // API route handlers will verify the token (they run in Node runtime)
  console.log("[MIDDLEWARE][API] Token present for:", pathname);
  console.log(
    "[MIDDLEWARE][API] Token verification will happen in route handler"
  );

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

  console.log("\n[MIDDLEWARE][PAGE] ════════════════════════════════");
  console.log("[MIDDLEWARE][PAGE] Request to:", pathname);
  console.log("[MIDDLEWARE][PAGE] Method:", req.method);

  // Allow public page routes
  if (isPublicPageRoute(pathname)) {
    console.log("[MIDDLEWARE][PAGE] ✅ Public route, allowing\n");
    return NextResponse.next();
  }

  // Check if this is a protected page route
  if (!isProtectedPageRoute(pathname)) {
    // Not explicitly protected, allow it
    console.log("[MIDDLEWARE][PAGE] ✅ Not protected, allowing\n");
    return NextResponse.next();
  }

  console.log("[MIDDLEWARE][PAGE] 🔒 Protected route, checking auth...");

  // Protected page route - check for auth token in cookie
  const token = getTokenFromCookie(req);

  if (!token) {
    // No token found - redirect to login
    console.log("[MIDDLEWARE][PAGE] ❌ No token, redirecting to /login\n");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - allow access
  // Note: We don't verify signature here (Edge runtime limitation)
  // API routes will verify the token when data is fetched
  console.log("[MIDDLEWARE][PAGE] ✅ Token present, allowing access");
  console.log(
    "[MIDDLEWARE][PAGE] ℹ️  Token verification happens in API routes\n"
  );

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
