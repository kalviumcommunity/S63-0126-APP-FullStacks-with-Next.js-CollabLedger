import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: '/api/tasks/[id]', method: 'PATCH' };

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, status } = body;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return handleValidationError('Invalid task ID', context);
    }

    // Validate input (at least one field must be provided)
    if (title === undefined && description === undefined && status === undefined) {
      return handleValidationError(
        'At least one field is required to update',
        context
      );
    }

    // Validate fields if provided
    if (title !== undefined && typeof title !== 'string') {
      return handleValidationError('Title must be a string', context);
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      return handleValidationError('Description must be a string', context);
    }

    if (status !== undefined && !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return handleValidationError('Invalid status value', context);
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return handleNotFound('Task', { ...context, taskId: id });
    }

    // Update task
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
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

    logger.info('Task updated successfully', {
      route: context.route,
      taskId: id,
      updatedFields: Object.keys(updateData),
    });

    return sendSuccess(updatedTask, 'Task updated successfully', 200);
  } catch (error) {
    return handleError(error, context);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: '/api/tasks/[id]', method: 'DELETE' };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return handleValidationError('Invalid task ID', context);
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return handleNotFound('Task', { ...context, taskId: id });
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    logger.info('Task deleted successfully', {
      route: context.route,
      taskId: id,
    });

    return sendSuccess(
      { message: 'Task deleted successfully' },
      'Task deleted successfully',
      200
    );
  } catch (error) {
    return handleError(error, context);
  }
}
