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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/projects/[id]", method: "GET" };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid project ID", context);
    }

    const getProjectCached = unstable_cache(
      async () => {
        return prisma.project.findUnique({
          where: { id },
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
      },
      ["api-project", id],
      { revalidate: 60, tags: ["projects", `project:${id}`] }
    );

    const project = await getProjectCached();

    if (!project) {
      return handleNotFound("Project", { ...context, projectId: id });
    }

    logger.info("Project retrieved successfully", {
      route: context.route,
      projectId: id,
    });

    return sendSuccess(project, "Project retrieved successfully", 200);
  } catch (error) {
    return handleError(error, context);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/projects/[id]", method: "PATCH" };

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, status } = body;

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid project ID", context);
    }

    // Validate input (at least one field must be provided)
    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      return handleValidationError(
        "At least one field is required to update",
        context
      );
    }

    // Validate fields if provided
    if (title !== undefined && typeof title !== "string") {
      return handleValidationError("Title must be a string", context);
    }

    if (description !== undefined && typeof description !== "string") {
      return handleValidationError("Description must be a string", context);
    }

    if (
      status !== undefined &&
      !["IDEA", "IN_PROGRESS", "COMPLETED"].includes(status)
    ) {
      return handleValidationError("Invalid status value", context);
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return handleNotFound("Project", { ...context, projectId: id });
    }

    // Update project
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
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

    logger.info("Project updated successfully", {
      route: context.route,
      projectId: id,
      updatedFields: Object.keys(updateData),
    });

    // Invalidate relevant caches after a successful write
    revalidateTag("projects", { expire: 0 });
    revalidateTag(`project:${id}`, { expire: 0 });
    revalidateTag(`projectTasks:${id}`, { expire: 0 });

    return sendSuccess(updatedProject, "Project updated successfully", 200);
  } catch (error) {
    return handleError(error, context);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: "/api/projects/[id]", method: "DELETE" };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== "string") {
      return handleValidationError("Invalid project ID", context);
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return handleNotFound("Project", { ...context, projectId: id });
    }

    // Delete project (cascades to tasks)
    await prisma.project.delete({
      where: { id },
    });

    logger.info("Project deleted successfully", {
      route: context.route,
      projectId: id,
    });

    // Invalidate relevant caches after a successful write
    revalidateTag("projects", { expire: 0 });
    revalidateTag(`project:${id}`, { expire: 0 });
    revalidateTag(`projectTasks:${id}`, { expire: 0 });

    return sendSuccess(
      { message: "Project deleted successfully" },
      "Project deleted successfully",
      200
    );
  } catch (error) {
    return handleError(error, context);
  }
}
