import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError, handleValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password";
import { signJWT } from "@/lib/auth";
import { redis } from "../../../../../lib/redis";

export async function POST(req: NextRequest) {
  const context = { route: "/api/auth/signup", method: "POST" };

  try {
    const body = await req.json();
    const { email, name, password } = body;

    // Validate input
    if (!email || typeof email !== "string") {
      return handleValidationError("Email is required", context);
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return handleValidationError(
        "Password is required and must be at least 6 characters",
        context
      );
    }
    if (name && typeof name !== "string") {
      return handleValidationError("Name must be a string", context);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return handleValidationError("User already exists", context);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT for auto-login
    const token = signJWT({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    logger.info("User created successfully", {
      route: context.route,
      userId: newUser.id,
      email: newUser.email,
    });

    // Return user info (excluding password)
    const userInfo = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    // Best-effort cache invalidation for Redis cached users list
    try {
      await redis.del("users:list");
    } catch (redisError) {
      logger.warn("Redis cache invalidation failed (users:list)", {
        route: context.route,
        redisError,
      });
    }

    // Create response with user info
    const response = sendSuccess(userInfo, "User created successfully", 201);

    // Set HTTP-only cookie with JWT token for auto-login
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
