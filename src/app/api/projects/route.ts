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

export async function GET(req: NextRequest) {
  const context = { route: "/api/projects", method: "GET" };

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

    const getProjectsCached = unstable_cache(
      async (pageArg: number, limitArg: number) => {
        const skip = (pageArg - 1) * limitArg;

        const [total, projects] = await Promise.all([
          prisma.project.count(),
          prisma.project.findMany({
            skip,
            take: limitArg,
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              ownerId: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        return { total, projects };
      },
      ["api-projects-list"],
      { revalidate: 30, tags: ["projects"] }
    );

    const { total, projects } = await getProjectsCached(page, limit);

    logger.info("Projects retrieved successfully", {
      route: context.route,
      page,
      limit,
      totalCount: total,
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

    if (!ownerId || typeof ownerId !== "string") {
      return handleValidationError(
        "OwnerId is required and must be a string",
        context
      );
    }

    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return handleNotFound("Owner", { ...context, ownerId });
    }

    // Create project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        ownerId,
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
