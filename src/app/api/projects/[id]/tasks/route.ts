import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: '/api/projects/[id]/tasks', method: 'GET' };

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate ID
    if (!id || typeof id !== 'string') {
      return handleValidationError('Invalid project ID', { ...context, projectId: id });
    }

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return handleValidationError(
        'Invalid pagination parameters',
        { ...context, projectId: id }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return handleNotFound('Project', { ...context, projectId: id });
    }

    const skip = (page - 1) * limit;

    // Get total count of tasks for this project
    const total = await prisma.task.count({
      where: { projectId: id },
    });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('Project tasks retrieved successfully', {
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
      'Project tasks retrieved successfully',
      200
    );
  } catch (error) {
    return handleError(error, { ...context, projectId: req.url });
  }
}
