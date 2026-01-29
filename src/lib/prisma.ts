// src/lib/prisma.ts

/**
 * Prisma Client singleton for Next.js App Router.
 * Prevents exhausting database connections during hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
