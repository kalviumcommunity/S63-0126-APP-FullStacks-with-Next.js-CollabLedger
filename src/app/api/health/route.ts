import { getDatabaseUrl, validateServerEnv } from '../../../lib/env.server';

export const runtime = 'nodejs';

function safeDatabaseInfo(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      database: url.pathname.replace('/', ''),
    };
  } catch {
    return {
      host: 'unknown',
      database: 'unknown',
    };
  }
}

export async function GET() {
  validateServerEnv();
  const databaseUrl = getDatabaseUrl();
  const safeInfo = safeDatabaseInfo(databaseUrl);

  return Response.json({
    status: 'ok',
    serverEnv: process.env.NODE_ENV || 'development',
    database: safeInfo,
  });
}
