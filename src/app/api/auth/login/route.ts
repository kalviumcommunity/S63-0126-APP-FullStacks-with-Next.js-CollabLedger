import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess } from '@/lib/responseHandler';
import { handleError, handleValidationError, handleNotFound } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const context = { route: '/api/auth/login', method: 'POST' };

  try {
    const body = await req.json();
    const { email } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return handleValidationError('Email is required', context);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return handleNotFound('User', { ...context, email });
    }

    logger.info('User login successful', {
      route: context.route,
      userId: user.id,
      email: user.email,
    });

    return sendSuccess(user, 'Login successful', 200);
  } catch (error) {
    return handleError(error, context);
  }
}
