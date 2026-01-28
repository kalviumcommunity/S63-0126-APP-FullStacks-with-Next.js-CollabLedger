# Stage 1: Builder
# This stage installs dependencies and builds the Next.js application.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to take advantage of Docker's layer caching.
# If these files haven't changed, Docker will reuse the cached dependencies.
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for the build).
RUN npm ci

# Copy the rest of the application source code.
COPY . .

# Build the Next.js app for production.
RUN npm run build

# Stage 2: Runtime
# This stage creates the final image that will actually run the application.
# We use a clean image to keep it small and secure.
FROM node:20-alpine AS runtime

# Set the working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Only copy the essential files from the builder stage.
# We need the build output (.next), public assets, node_modules, and package.json.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000 to allow access to the web server.
EXPOSE 3000

# Start the Next.js application.
CMD ["npm", "run", "start"]
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
