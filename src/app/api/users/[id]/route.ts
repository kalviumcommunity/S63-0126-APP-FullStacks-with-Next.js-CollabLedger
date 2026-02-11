import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import {
  handleError,
  handleValidationError,
  handleNotFound,
} from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import { redis } from "../../../../../lib/redis";

const USERS_LIST_KEY = "users:list";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/users/[id]", method: "GET" };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid user ID", context);
    }

    const getUserCached = unstable_cache(
      async () => {
        return prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      },
      ["api-user", id],
      { revalidate: 300, tags: ["users", `user:${id}`] }
    );

    const user = await getUserCached();

    if (!user) {
      return handleNotFound("User", { ...context, userId: id });
    }

    logger.info("User retrieved successfully", {
      route: context.route,
      userId: id,
    });

    return sendSuccess(user, "User retrieved successfully", 200);
  } catch (error) {
    return handleError(error, context);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/users/[id]", method: "PATCH" };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid user ID", context);
    }

    const body = await req.json();
    const { name } = body;

    // Validate input
    if (name === undefined) {
      return handleValidationError(
        "At least one field is required to update",
        context
      );
    }

    if (name !== null && typeof name !== "string") {
      return handleValidationError("Name must be a string or null", context);
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return handleNotFound("User", { ...context, userId: id });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Cache invalidation (best-effort)
    try {
      await redis.del(USERS_LIST_KEY);
      logger.info(`Cache Invalidated: ${USERS_LIST_KEY}`, {
        ...context,
        userId: id,
      });
    } catch (redisError) {
      logger.warn("Redis delete failed during invalidation", {
        ...context,
        userId: id,
        redisError,
      });
    }

    return sendSuccess(updatedUser, "User updated successfully", 200);
  } catch (error) {
    return handleError(error, context);
  }
}
