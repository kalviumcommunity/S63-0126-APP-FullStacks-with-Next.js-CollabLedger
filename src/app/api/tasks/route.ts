import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, projectId } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return sendError(
        'Title is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    if (!projectId || typeof projectId !== 'string') {
      return sendError(
        'ProjectId is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      return sendError(
        'Description must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return sendError(
        'Project not found',
        ERROR_CODES.PROJECT_NOT_FOUND,
        404
      );
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

    return sendSuccess(
      newTask,
      'Task created successfully',
      201
    );
  } catch (error) {
    console.error('Create task error:', error);
    return sendError(
      'Failed to create task',
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}
