import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { handleError, handleValidationError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { redis } from "../../../../lib/redis";

const USERS_LIST_TTL_SECONDS = 60;
const USERS_LIST_KEY = "users:list";

export async function GET(req: NextRequest) {
  const context = { route: "/api/users", method: "GET" };

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return handleValidationError(
        "Invalid pagination parameters. Page and limit must be positive, limit must not exceed 100.",
        context
      );
    }

    // Cache-aside pattern:
    // 1) Try Redis first (cache hit)
    // 2) On miss, query Prisma, store in Redis with TTL, then return
    const cacheKey =
      page === 1 && limit === 10
        ? USERS_LIST_KEY
        : `${USERS_LIST_KEY}:${page}:${limit}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.info(`Cache Hit: ${cacheKey}`, { ...context, page, limit });
        const parsed = JSON.parse(cached) as {
          users: Array<{
            id: string;
            email: string;
            name: string | null;
            createdAt: string;
            updatedAt: string;
          }>;
          pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };
        return sendSuccess(parsed, "Users retrieved successfully", 200);
      }
      logger.info(`Cache Miss: ${cacheKey}`, { ...context, page, limit });
    } catch (redisError) {
      // Redis should never block the API; fall back to DB on any cache failure.
      logger.warn("Redis read failed; falling back to Prisma", {
        ...context,
        page,
        limit,
        redisError,
      });
    }

    const skip = (page - 1) * limit;
    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const payload = {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    try {
      await redis.set(
        cacheKey,
        JSON.stringify(payload),
        "EX",
        USERS_LIST_TTL_SECONDS
      );
    } catch (redisError) {
      logger.warn("Redis write failed; responding without cache", {
        ...context,
        page,
        limit,
        redisError,
      });
    }

    logger.info("Users retrieved successfully", {
      route: context.route,
      page,
      limit,
      totalCount: total,
    });

    return sendSuccess(payload, "Users retrieved successfully", 200);
  } catch (error) {
    return handleError(error, context);
  }
}

export async function POST(req: NextRequest) {
  const context = { route: "/api/users", method: "POST" };

  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || typeof email !== "string") {
      return handleValidationError(
        "Email is required and must be a string",
        context
      );
    }

    if (!password || typeof password !== "string") {
      return handleValidationError(
        "Password is required and must be a string",
        context
      );
    }

    if (name !== undefined && name !== null && typeof name !== "string") {
      return handleValidationError("Name must be a string", context);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return handleValidationError("User already exists", context);
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        password,
      },
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
      logger.info(`Cache Invalidated: ${USERS_LIST_KEY}`, context);
    } catch (redisError) {
      logger.warn("Redis delete failed during invalidation", {
        ...context,
        redisError,
      });
    }

    return sendSuccess(newUser, "User created successfully", 201);
  } catch (error) {
    return handleError(error, context);
  }
}
