import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError, handleValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const context = { route: "/api/auth/signup", method: "POST" };

  try {
    const body = await req.json();
    const { email, name } = body;
    console.log("Received signup request with body:", body);

    // Validate input
    if (!email || typeof email !== "string") {
      return handleValidationError("Email is required", context);
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

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
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

    // Invalidate relevant caches after a successful write
    revalidateTag("users", { expire: 0 });
    revalidateTag(`user:${newUser.id}`, { expire: 0 });

    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    return handleError(error, context);
  }
}
