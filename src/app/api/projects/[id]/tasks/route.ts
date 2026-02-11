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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/projects/[id]/tasks", method: "GET" };

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid project ID", {
        ...context,
        projectId: id,
      });
    }

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return handleValidationError("Invalid pagination parameters", {
        ...context,
        projectId: id,
      });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return handleNotFound("Project", { ...context, projectId: id });
    }

    const getProjectTasksCached = unstable_cache(
      async (projectId: string, pageArg: number, limitArg: number) => {
        const skip = (pageArg - 1) * limitArg;

        const [total, tasks] = await Promise.all([
          prisma.task.count({
            where: { projectId },
          }),
          prisma.task.findMany({
            where: { projectId },
            skip,
            take: limitArg,
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              projectId: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);

        return { total, tasks };
      },
      ["api-project-tasks", id],
      { revalidate: 30, tags: [`project:${id}`, `projectTasks:${id}`] }
    );

    const { total, tasks } = await getProjectTasksCached(id, page, limit);

    logger.info("Project tasks retrieved successfully", {
      route: context.route,
      projectId: id,
      page,
      limit,
      totalCount: total,
    });

    return sendSuccess(
      {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Project tasks retrieved successfully",
      200
    );
  } catch (error) {
    return handleError(error, { ...context, projectId: req.url });
  }
}
