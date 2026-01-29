import { prisma } from '../../../lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const users = await prisma.user.findMany({
    take: 1,
    select: { id: true },
  });

  console.log('Prisma test query OK', { userCount: users.length });

  return Response.json({
    status: 'ok',
    userCount: users.length,
  });
}
