import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const context = { route: '/api/tasks', method: 'POST' };

  try {
    const body = await req.json();
    const { title, description, projectId } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return handleValidationError(
        'Title is required and must be a string',
        context
      );
    }

    if (!projectId || typeof projectId !== 'string') {
      return handleValidationError(
        'ProjectId is required and must be a string',
        context
      );
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      return handleValidationError(
        'Description must be a string',
        context
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return handleNotFound('Project', { ...context, projectId });
    }

    // Create task
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info('Task created successfully', {
      route: context.route,
      taskId: newTask.id,
      projectId: newTask.projectId,
    });

    return sendSuccess(newTask, 'Task created successfully', 201);
  } catch (error) {
    return handleError(error, context);
  }
}
