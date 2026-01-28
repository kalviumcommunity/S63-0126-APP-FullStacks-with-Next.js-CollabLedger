# Stage 1: Dependencies
# We use a multi-stage build to keep the final image small.
# node:20-alpine is a lightweight Linux distribution with Node.js 20.
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies. npm ci is used for a clean, deterministic install.
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
# This stage compiles the TypeScript code into production-ready JavaScript.
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build script to generate the .next folder.
RUN npm run build

# Stage 3: Runner
# This is the final image that will be deployed. It only contains the essentials.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user for security (best practice for production).
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and the standalone build output.
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone mode copies only the necessary node_modules into the build output,
# drastically reducing image size from GBs to MBs.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# The app listens on port 3000.
EXPOSE 3000
ENV PORT 3000

# Start the application using the standalone server entry point.
CMD ["node", "server.js"]
