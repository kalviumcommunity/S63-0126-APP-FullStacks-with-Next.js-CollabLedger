import Redis from "ioredis";

const DEFAULT_REDIS_URL = "redis://localhost:6379";

function getRedisUrl(): string {
  return process.env.REDIS_URL || DEFAULT_REDIS_URL;
}

type GlobalWithRedis = typeof globalThis & { __redisClient?: Redis };

/**
 * Redis singleton client.
 *
 * - Reads `process.env.REDIS_URL` (no credentials are hardcoded)
 * - Falls back to `redis://localhost:6379` for local development
 * - Reuses the client across hot reloads in dev
 */
const globalForRedis = globalThis as GlobalWithRedis;

export const redis: Redis =
  globalForRedis.__redisClient ??
  new Redis(getRedisUrl(), {
    // Fail fast on transient issues; routes will gracefully fall back to Prisma
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: false,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.__redisClient = redis;
