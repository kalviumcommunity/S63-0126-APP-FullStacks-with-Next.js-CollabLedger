/**
 * Authentication & Authorization Utilities
 *
 * Provides reusable functions for JWT verification, user extraction,
 * and role-based access control across the application.
 */

import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

/**
 * Get JWT secret from environment variables
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

/**
 * Decoded JWT payload structure
 * Includes user identification and authorization information
 */
export interface DecodedToken {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "EDITOR";
  iat?: number;
  exp?: number;
}

/**
 * User context extracted from request
 * Available after middleware verification
 */
export interface UserContext {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "EDITOR";
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string (without 'Bearer ' prefix)
 * @returns Decoded token payload if valid
 * @throws Error if token is invalid or expired
 */
export function verifyJWT(token: string): DecodedToken {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return decoded as DecodedToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("INVALID_TOKEN");
    }
    throw error;
  }
}

/**
 * Extract JWT token from Authorization header
 * Expected format: "Bearer <token>"
 * @param authHeader - Authorization header value
 * @returns Token string without 'Bearer ' prefix, or null if missing
 */
export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Extract user context from request headers
 * These headers are set by middleware after JWT verification
 * @param req - NextRequest object
 * @returns User context or null if not authenticated
 */
export function extractUserFromHeaders(req: NextRequest): UserContext | null {
  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");
  const userRole = req.headers.get("x-user-role");

  if (!userId || !userEmail || !userRole) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
    role: userRole as "ADMIN" | "USER" | "EDITOR",
  };
}

/**
 * Check if user has required role(s)
 * @param userRole - User's current role
 * @param requiredRoles - Role(s) that have access
 * @returns True if user's role is in required roles
 */
export function hasRole(
  userRole: string,
  requiredRoles: string | string[]
): boolean {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
}

/**
 * Check if user is admin
 * @param userRole - User's current role
 * @returns True if user is admin
 */
export function isAdmin(userRole: string): boolean {
  return userRole === "ADMIN";
}

/**
 * Check if user is admin or editor
 * @param userRole - User's current role
 * @returns True if user is admin or editor
 */
export function isAdminOrEditor(userRole: string): boolean {
  return ["ADMIN", "EDITOR"].includes(userRole);
}

/**
 * Create JWT token for user
 * Used during login/signup to generate authentication tokens
 * @param userId - User ID (UUID)
 * @param email - User email
 * @param role - User role (ADMIN, USER, EDITOR)
 * @returns Signed JWT token
 */
export function createJWT(
  userId: string,
  email: string,
  role: "ADMIN" | "USER" | "EDITOR"
): string {
  const payload: Omit<DecodedToken, "iat" | "exp"> = {
    id: userId,
    email,
    role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "1h", // 1 hour expiration
  });
}

/**
 * Type guard to check if value is a valid UserRole
 */
export function isValidUserRole(
  value: unknown
): value is "ADMIN" | "USER" | "EDITOR" {
  return ["ADMIN", "USER", "EDITOR"].includes(String(value));
}

/**
 * Sign a JWT token with the given payload
 * @param payload - Data to be included in the token
 * @returns Signed JWT string
 */
export function signJWT(payload: DecodedToken): string {
  const { id, email, role } = payload;
  return jwt.sign({ id, email, role }, getJwtSecret(), {
    expiresIn: "1d",
  });
}
