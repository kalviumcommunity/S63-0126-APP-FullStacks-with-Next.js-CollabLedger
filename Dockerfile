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
