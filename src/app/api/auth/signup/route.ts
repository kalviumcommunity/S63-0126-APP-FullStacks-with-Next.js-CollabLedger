import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError, handleValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password";

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
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info("User created successfully", {
      route: context.route,
      userId: newUser.id,
      email: newUser.email,
    });

    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    return handleError(error, context);
  }
}
