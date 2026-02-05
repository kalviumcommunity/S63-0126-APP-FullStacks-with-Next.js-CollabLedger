import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = { route: '/api/users/[id]', method: 'GET' };

  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return handleValidationError('Invalid user ID', context);
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return handleNotFound('User', { ...context, userId: id });
    }

    logger.info('User retrieved successfully', {
      route: context.route,
      userId: id,
    });

    return sendSuccess(user, 'User retrieved successfully', 200);
  } catch (error) {
    return handleError(error, context);
  }
}
