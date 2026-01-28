# Stage 1: Build Stage
# This stage installs dependencies and builds the application.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker's cache for dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run Stage
# This stage creates the final lightweight image to run the app.
FROM node:20-alpine AS runner

WORKDIR /app

# Environment set to production for performance optimizations
ENV NODE_ENV production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application using npm run start
CMD ["npm", "run", "start"]
