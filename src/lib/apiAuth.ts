import { NextRequest } from "next/server";
import { verifyJWT, extractTokenFromHeader } from "./auth";
import { sendError } from "./responseHandler";
import { ERROR_CODES } from "./errorCodes";

/**
 * Helper function for API routes to verify JWT tokens and extract user info
 * This runs in Node.js runtime (not Edge) so it can use crypto modules
 */
export function verifyApiRequest(req: NextRequest): {
  success: boolean;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  error?: Response;
} {
  // Extract token from Authorization header OR cookie
  const authHeader = req.headers.get("authorization");
  let token = extractTokenFromHeader(authHeader);

  // If no Authorization header, try cookie (for browser fetch calls)
  if (!token) {
    token = req.cookies.get("token")?.value || null;
  }

  if (!token) {
    return {
      success: false,
      error: new Response(
        JSON.stringify(
          sendError(
            "Authorization token is missing",
            ERROR_CODES.UNAUTHORIZED,
            401
          )
        ),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  // Verify JWT token
  try {
    const decoded = verifyJWT(token);

    return {
      success: true,
      userId: decoded.id,
      userEmail: decoded.email,
      userRole: decoded.role,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid token";
    const status = errorMessage === "TOKEN_EXPIRED" ? 401 : 403;
    const code =
      errorMessage === "TOKEN_EXPIRED"
        ? ERROR_CODES.TOKEN_EXPIRED
        : ERROR_CODES.INVALID_TOKEN;

    return {
      success: false,
      error: new Response(
        JSON.stringify(sendError(errorMessage, code, status)),
        {
          status,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }
}
