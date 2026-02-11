import { prisma } from '../../../lib/prisma';
import { sendSuccess } from '../../../lib/responseHandler';
import { handleError } from '../../../lib/errorHandler';

export const runtime = 'nodejs';

export async function GET() {
  const context = { route: '/api/prisma-test', method: 'GET' };

  try {
    const users = await prisma.user.findMany({
      take: 1,
      select: { id: true },
    });

    return sendSuccess(
      { userCount: users.length },
      'Prisma database connection successful',
      200
    );
  } catch (error) {
    return handleError(error, context);
  }
}
