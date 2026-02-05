/**
 * Server-side database configuration
 * 
 * This file demonstrates safe server-side usage of environment variables.
 * The DATABASE_URL variable is:
 * - Only accessible on the server (not exposed to the browser)
 * - Used by Prisma ORM for database connections
 * - Validated at startup to ensure configuration is correct
 * 
 * IMPORTANT: Do NOT import this in client components.
 * This file should only be used in:
 * - Server components
 * - API routes
 * - Server utilities
 */

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add it to your .env.* file or CI secrets.'
    );
  }

  return databaseUrl;
}

/**
 * Validate environment variables at startup
 * This ensures the application has all required server-side configuration
 */
export function validateServerEnv(): void {
  const requiredVars = ['DATABASE_URL'];

  const missingVars = requiredVars.filter(
    (variable) => !process.env[variable]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Server environment validation passed
}
