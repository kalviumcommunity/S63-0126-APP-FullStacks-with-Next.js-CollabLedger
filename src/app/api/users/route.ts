import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const context = { route: '/api/users', method: 'GET' };

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return handleValidationError(
        'Invalid pagination parameters. Page and limit must be positive, limit must not exceed 100.',
        context
      );
    }

    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.user.count();

    // Get users with pagination
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });

    logger.info('Users retrieved successfully', {
      route: context.route,
      page,
      limit,
      totalCount: total,
    });

    return sendSuccess(
      {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Users retrieved successfully',
      200
    );
  } catch (error) {
    return handleError(error, context);
  }
}
