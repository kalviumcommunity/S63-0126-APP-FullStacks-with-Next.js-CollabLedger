import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import {
  handleError,
  handleValidationError,
  handleNotFound,
} from "@/lib/errorHandler";
import { logger } from "@/lib/logger";
import { revalidateTag, unstable_cache } from "next/cache";
import { verifyApiRequest } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const context = { route: "/api/projects", method: "GET" };

  try {
    // Verify authentication (runs in Node runtime, can use crypto)
    const auth = verifyApiRequest(req);
    if (!auth.success) {
      return auth.error;
    }

    const userId = auth.userId!;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const mine = searchParams.get("mine") === "true";
    const publicProjects = searchParams.get("public") === "true";
    const contributed = searchParams.get("contributed") === "true";

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return handleValidationError(
        "Invalid pagination parameters. Page and limit must be positive, limit must not exceed 100.",
        context
      );
    }

    const cacheKey = `api-projects-list:${userId}:${page}:${limit}:${mine}:${publicProjects}:${contributed}`;
    const getProjectsCached = unstable_cache(
      async () => {
        const skip = (page - 1) * limit;

        // This query param is used by the dashboard, but the backend support
        // may not exist yet. Return an empty list gracefully (no crash).
        if (contributed) {
          return { total: 0, projects: [] as unknown[] };
        }

        // Build filter based on query params
        let where: Record<string, unknown> = {};

        if (mine) {
          // Get projects owned by current user
          where = { ownerId: userId };
        } else if (publicProjects) {
          // Get projects NOT owned by current user
          where = {
            NOT: { ownerId: userId },
          };
        }

        const [total, projects] = await Promise.all([
          prisma.project.count({ where }),
          prisma.project.findMany({
            skip,
            take: limit,
            where,
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              ownerId: true,
              createdAt: true,
              updatedAt: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              tasks: {
                select: {
                  id: true,
                  status: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        return { total, projects };
      },
      [cacheKey],
      { revalidate: 30, tags: ["projects"] }
    );

    const { total, projects } = await getProjectsCached();
    logger.info("Projects retrieved successfully", {
      route: context.route,
      page,
      limit,
      totalCount: total,
      mine,
      publicProjects,
      contributed,
      userId: userId || undefined,
    });

    return sendSuccess(
      {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Projects retrieved successfully",
      200
    );
  } catch (error) {
    return handleError(error, context);
  }
}

export async function POST(req: NextRequest) {
  const context = { route: "/api/projects", method: "POST" };

  try {
    // Verify authentication (runs in Node runtime, can use crypto)
    const auth = verifyApiRequest(req);
    if (!auth.success) {
      return auth.error;
    }
    const userId = auth.userId!;

    const body = await req.json();
    const { title, description, ownerId } = body;

    // Validate required fields
    if (!title || typeof title !== "string") {
      return handleValidationError(
        "Title is required and must be a string",
        context
      );
    }

    if (!description || typeof description !== "string") {
      return handleValidationError(
        "Description is required and must be a string",
        context
      );
    }

    // Enforce ownerId = authenticated user (production-safe)
    const effectiveOwnerId =
      ownerId && typeof ownerId === "string" ? ownerId : userId;
    if (effectiveOwnerId !== userId) {
      return handleValidationError(
        "OwnerId must match the authenticated user",
        context
      );
    }

    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: effectiveOwnerId },
    });

    if (!owner) {
      return handleNotFound("Owner", { ...context, ownerId: effectiveOwnerId });
    }

    // Create project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        ownerId: effectiveOwnerId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info("Project created successfully", {
      route: context.route,
      projectId: newProject.id,
      ownerId: newProject.ownerId,
    });

    // Invalidate relevant caches after a successful write
    revalidateTag("projects", { expire: 0 });
    revalidateTag(`project:${newProject.id}`, { expire: 0 });
    return sendSuccess(newProject, "Project created successfully", 201);
  } catch (error) {
    return handleError(error, context);
  }
}
