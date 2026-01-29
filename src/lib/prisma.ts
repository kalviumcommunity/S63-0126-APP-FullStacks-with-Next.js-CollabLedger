// src/lib/prisma.ts

/**
 * Placeholder for Prisma Client.
 * In a future sprint, this will be used to initialize the Prisma Client
 * to interact with the database.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
