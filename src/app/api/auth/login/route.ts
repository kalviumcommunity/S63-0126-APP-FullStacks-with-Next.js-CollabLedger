import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import {
  handleError,
  handleValidationError,
  handleNotFound,
} from "@/lib/errorHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { logger } from "@/lib/logger";
import { comparePasswords } from "@/lib/password";
import { signJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const context = { route: "/api/auth/login", method: "POST" };

  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || typeof email !== "string") {
      return handleValidationError("Email is required", context);
    }

    if (!password || typeof password !== "string") {
      return handleValidationError("Password is required", context);
    }

    // Find user (include password and role for verification)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return handleNotFound("User", { ...context, email });
    }

    // Verify password if user has one
    if (!user.password) {
      // This case handles users who might have been created without a password
      return sendError(
        "Invalid credentials",
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return sendError(
        "Invalid credentials",
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

    // Generate JWT
    const token = signJWT({ id: user.id, email: user.email, role: user.role });

    logger.info("User login successful", {
      route: context.route,
      userId: user.id,
      email: user.email,
    });

    // Return user info (excluding password)
    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Create response with user info
    const response = sendSuccess(userInfo, "Login successful", 200);

    // Set HTTP-only cookie with JWT token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return handleError(error, context);
  }
}
