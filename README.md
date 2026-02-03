# CollabLedger

CollabLedger is a centralized platform designed to streamline collaboration between NGOs and open-source contributors. By providing visibility into ongoing projects and contribution pipelines, it aims to eliminate redundant efforts and maximize the impact of social good initiatives.

## Problem Statement

NGOs and open-source contributors often work in silos, leading to significant duplication of work. Without a clear view of existing projects or active contribution pipelines, valuable resources are wasted on solving problems that have already been addressed elsewhere. CollabLedger solves this by providing a transparent, unified dashboard for project tracking and collaboration.

## Folder Structure

The project follows a standard Next.js `src/` directory structure to ensure clean separation of concerns:

- `src/app/`: Contains the App Router pages, layouts, and API routes. This is the core of the application's routing logic.
- `src/components/`: Dedicated to reusable UI components (e.g., Headers, Buttons, Modals, Cards). This promotes the "Don't Repeat Yourself" (DRY) principle.
- `src/lib/`: Holds utility functions, shared configurations, and third-party library initializations (e.g., Prisma client, configuration helpers).

## Setup Instructions

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd CollabLedger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment-Aware Builds & Secrets

### Environment Differences
- **Development** (`.env.development`): local services and localhost API base URL.
- **Staging** (`.env.staging`): pre-production endpoints for integration testing.
- **Production** (`.env.production`): production endpoints and database URLs.

### Where Secrets Are Stored
- **Local**: `.env.development`, `.env.staging`, `.env.production` (ignored by Git).
- **CI/CD**: GitHub Secrets inject values at build time.
- **Runtime (optional AWS)**: AWS Secrets Manager or SSM Parameter Store.

### Why Env-Aware Builds Improve CI/CD
- Prevents accidental cross-environment configuration.
- Ensures the correct API endpoints and database connections are used per build.
- Makes deployments reproducible and auditable with explicit environment selection.

### Local Build Verification
```bash
npm run build:staging
npm run build:production
```
If the build succeeds, the `NEXT_PUBLIC_APP_ENV` badge on the homepage and the
`/api/health` response will reflect the selected environment.

## Prisma ORM Setup

### Why Prisma in CollabLedger?
Prisma provides a type-safe database client, reduces runtime query errors, and
improves developer productivity with autocompletion and schema-driven modeling.
This aligns with the project's need for reliable data access in a collaborative
platform.

### Setup Steps Performed
1. Installed Prisma and Prisma Client.
2. Initialized Prisma with PostgreSQL (`DATABASE_URL` from env vars).
3. Defined MVP models (`User`, `Project`) with relations.
4. Generated Prisma Client.
5. Implemented a singleton client for Next.js.
6. Verified connection via a safe test query.

### `schema.prisma` (excerpt)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String   @id @default(uuid())
  email    String   @unique
  name     String?
  projects Project[]
}

model Project {
  id      String  @id @default(uuid())
  title   String
  ownerId String
  owner   User    @relation(fields: [ownerId], references: [id], onDelete: Cascade)
}
```

### `src/lib/prisma.ts` (singleton)
```typescript
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
```

### Proof of Connection
Run the app and call:
```
GET /api/prisma-test
```
Expected response (no sensitive data):
```json
{ "status": "ok", "userCount": 0 }
```

### Reflection
Prisma improves reliability by enforcing schema constraints at compile time,
reducing mismatched queries. It also accelerates development with generated
types, which lowers the chance of runtime crashes and makes refactors safer.

## Reflection

### Why this folder structure was chosen?
The `src/` directory structure with segregated `app`, `components`, and `lib` folders was chosen to align with industry best practices for Next.js applications. It keeps the root directory clean and provides a clear map of where different types of code should reside.

### How it supports scalability and collaboration?
- **Scalability**: By separating UI components from page logic and utility functions, the codebase remains manageable as it grows. New features can be added by creating new routes in `app/` and reusing existing components from `components/`.
- **Collaboration**: A standardized structure reduces the cognitive load for new contributors. Team members can easily locate files, reducing the friction often found in large-scale collaborative projects.

## Advanced Rendering Strategies (SSG, SSR, ISR)

This project demonstrates three fundamental rendering strategies in Next.js App Router, each optimized for different use cases:

### 1. Static Site Generation (SSG) - `/about`
**File:** `src/app/about/page.tsx`

**Configuration:**
```typescript
export const revalidate = false;
```

**Why This Strategy?**
- The About page contains static content that rarely changes (company information, mission statement, etc.)
- Pre-rendering at build time provides lightning-fast response times
- No server computation needed per request
- Excellent for SEO since the HTML is always available

**Performance Benefits:**
- Zero latency: Content is served directly from CDN or cache
- Minimal server load
- Predictable performance regardless of traffic volume
- Can be served globally via edge networks without database queries

**When to Use SSG:**
- Blogs, documentation, landing pages
- Content that updates on a release schedule (not daily)
- Pages where user personalization is not needed

---

### 2. Server-Side Rendering (SSR) - `/dashboard`
**File:** `src/app/dashboard/page.tsx`

**Configuration:**
```typescript
export const dynamic = 'force-dynamic';
// Fetch data with: cache: 'no-store'
```

**Why This Strategy?**
- Real-time metrics and live data must be fetched on every request
- User-specific information requires server-side computation
- Authentication context is available only on the server
- Data freshness is critical for accuracy

**Performance Characteristics:**
- Fresh data on every request
- Slower initial response time (requires server processing)
- Higher server CPU usage
- Non-cacheable by CDN (must hit the origin server)

**When to Use SSR:**
- Real-time dashboards and analytics
- Personalized user experiences (e.g., "Welcome, [User Name]")
- Pages requiring authentication or user context
- APIs with frequently changing data

---

### 3. Incremental Static Regeneration (ISR) - `/products`
**File:** `src/app/products/page.tsx`

**Configuration:**
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

**Why This Strategy?**
- Product catalogs update periodically but not on every request
- Best of both worlds: fast static serving + periodic freshness
- Background revalidation prevents user requests from blocking on slow data fetches
- Reduces server load while maintaining reasonable data freshness

**Performance Benefits:**
- Sub-millisecond response times (served as static HTML)
- Automatic background regeneration every 60 seconds
- Scales to handle 10x traffic without additional server load
- Users always get fast responses, even if revalidation is happening

**When to Use ISR:**
- Product catalogs, inventory pages
- Blog feeds with periodic updates
- News sites with frequent but not real-time updates
- Seasonal or frequently-updated content

---

### Strategy Comparison Table

| Aspect | SSG | SSR | ISR |
|--------|-----|-----|-----|
| **Build Time** | Yes | No | Yes |
| **Per-Request Computation** | No | Yes | No (background) |
| **Data Freshness** | Low (build-time) | High (every request) | Medium (periodic) |
| **Response Time** | Fastest | Slower | Fast |
| **Server Load** | Minimal | High | Low |
| **CDN-Cacheable** | Yes | No | Yes (with TTL) |
| **Scalability** | Excellent | Limited | Excellent |

---

### Scaling Consideration: What If You Had 10x More Users?

**Short Answer:** No, SSR everywhere would become a bottleneck and an expensive mistake.

**Detailed Analysis:**

If your app had **10x more users**, the rendering strategy breakdown would change dramatically:

**SSR Challenges at Scale:**
- **Server Load:** Each user request requires a fresh database query, API call, and server-side rendering. With 10x users, you'd need approximately 10x more server capacity, increasing infrastructure costs exponentially.
- **Response Time Degradation:** As server load increases, response times increase. At peak traffic, users experience slow page loads.
- **Difficult to Scale:** Adding more servers doesn't help equally—database bottlenecks, network latency, and cache invalidation become issues.

**Optimal Strategy for 10x Scale:**

1. **SSG (50% of pages):** Maximize SSG usage
   - All static content (landing pages, docs, terms) can serve globally via CDN
   - Zero server load per request
   - Response time: ~50-100ms globally

2. **ISR (30% of pages):** Use for frequently-viewed but periodically-updated content
   - Product catalogs, category pages, popular feeds
   - Revalidate every 5-60 seconds depending on freshness needs
   - Server load: 1-2% of what SSR would be

3. **SSR (20% of pages):** Reserve only for truly dynamic content
   - User dashboards, personalized feeds, checkout pages
   - Use caching strategies (Redis, in-memory) for common queries
   - Implement incremental loading and streaming (React Server Components)

**Real-World Example:**
- **With SSR everywhere:** 10x users = ~10x server cost ($50K → $500K/month)
- **With SSG/ISR hybrid:** 10x users = ~2x server cost ($50K → $100K/month)

This is why major platforms (Netflix, Amazon, GitHub) use a careful blend of these strategies—not SSR everywhere.
### TypeScript & ESLint Configuration

#### Why strict TypeScript mode reduces runtime bugs?
Enabling strict mode in TypeScript (e.g., `strict`, `noImplicitAny`, `noUnusedLocals`) ensures that the compiler catches potential errors at development time rather than runtime. It forces developers to handle null/undefined cases and ensures type safety across the application, significantly reducing "undefined is not a function" errors.

#### What our chosen ESLint + Prettier rules enforce?
- **Prettier**: Enforces consistent code formatting (double quotes, semicolons, 2-space indentation), which makes the codebase easier to read and reduces git diff noise from formatting changes.
- **ESLint**: Enforces code quality rules, such as warning against `console.log` and ensuring semicolons and quotes are used consistently.

#### How pre-commit hooks improve team consistency?
Using Husky and `lint-staged`, we ensure that every piece of code committed to the repository is automatically linted and formatted. This prevents "broken" or poorly formatted code from entering the main codebase, maintaining a high standard of quality across the entire team without manual intervention.

## PostgreSQL Schema Design

For Sprint-1, we have designed a normalized relational schema that captures the core entities of CollabLedger: **Users**, **Projects**, and **Tasks**.

### 1. Schema Overview
Our database uses PostgreSQL with Prisma ORM to ensure type safety and easy migrations. We focus on a clean, scalable structure that avoids redundancy through proper normalization.

#### Core Entities:
- **User**: Stores basic profile information.
- **Project**: Represents an NGO initiative or open-source project.
- **Task**: Represents specific units of work within a project's pipeline.

### 2. Entity Relationship Explanation
- **User → Project (1:Many)**: Each project is owned by a single user (the project creator/NGO member), but one user can own multiple projects.
- **Project → Task (1:Many)**: Each task belongs to exactly one project, providing a clear hierarchy for project pipelines.

### 3. Key Constraints & Data Integrity
- **UUIDs for IDs**: We use UUIDs instead of auto-incrementing integers to improve security and scalability (making IDs unguessable).
- **Unique Constraint**: The `email` field in the `User` table is unique to prevent duplicate accounts.
- **Enums**: We use PostgreSQL Enums for `ProjectStatus` and `TaskStatus`. This ensures that only valid states (like `IDEA`, `IN_PROGRESS`, `TODO`, `DONE`) can be saved, providing strong data integrity at the database level.
- **Cascading Deletes**: Relationships are configured with `onDelete: Cascade`. If a project is deleted, all its associated tasks are automatically removed, preventing "orphan" records.

### 4. Indexing & Performance
To ensure fast queries as the platform grows, we have implemented several strategic indexes:
- **Foreign Key Indexes**: On `ownerId` (Project table) and `projectId` (Task table) to speed up relationship lookups.
- **Status Indexes**: On `status` fields to optimize filtering projects by their current progress stage.

### 5. Normalization (1NF, 2NF, 3NF)
Our schema is fully normalized to the **Third Normal Form (3NF)**:
- **1NF (Atomic fields)**: Each column contains only one value (e.g., no comma-separated lists of tasks inside the Project table).
- **2NF (No partial dependency)**: All non-key attributes are fully dependent on the primary key.
- **3NF (No transitive dependency)**: Non-key attributes do not depend on other non-key attributes, eliminating unnecessary data duplication.

### 6. Migrations & Verification
We use Prisma's migration tool to keep the database in sync with our schema:
```bash
# Apply migrations to the database
npx prisma migrate dev --name init_schema

# Open Prisma Studio to verify data visually
npx prisma studio

# Seed initial data for testing
npx ts-node prisma/seed.ts
```

### 7. Seed Data Strategy
To test our relational design, we have included a script in `prisma/seed.ts` that:
1. Creates a dummy **User** (NGO member).
2. Links a **Project** to that User.
3. Attaches multiple **Tasks** to that Project.
This ensures that the foreign key constraints and cascading deletes are working exactly as intended during development.

---

## Reflection: Schema Design

**Why this schema supports growth?**
By using UUIDs and a normalized 3NF structure, we have built a foundation where adding new features (like comments or contributors) won't require massive rewrites. The use of indexes on foreign keys and status fields ensures that even with thousands of projects, the platform remains responsive.

**Which queries are most common and how the schema helps?**
- **Listing public projects by status**: The index on `Project.status` makes this query extremely efficient.
- **Viewing a project's task pipeline**: The indexing of `Task.projectId` allows us to fetch all tasks for a dashboard view almost instantly.
- **NGO Dashboard**: Fetching projects owned by a specific user is optimized by the `ownerId` index.

## API Route Structure & Naming

### Overview
The CollabLedger API follows REST (Representational State Transfer) principles using Next.js App Router file-based routing. All endpoints are organized by resource (nouns, plural, lowercase) to ensure predictability and maintainability. This approach makes the API intuitive for frontend teams and reduces the learning curve during onboarding.

### API Route Hierarchy

```
app/api/
├── auth/
│   ├── login/route.ts           # POST - User login
│   ├── signup/route.ts          # POST - User registration
├── users/
│   ├── route.ts                 # GET - List all users (paginated)
│   └── [id]/route.ts            # GET - Retrieve user by ID
├── projects/
│   ├── route.ts                 # GET - List projects, POST - Create project
│   ├── [id]/route.ts            # GET/PATCH/DELETE - Manage specific project
│   └── [id]/tasks/route.ts      # GET - Retrieve tasks for a project
└── tasks/
    ├── route.ts                 # POST - Create task
    └── [id]/route.ts            # PATCH/DELETE - Manage specific task
```

### API Endpoints Reference Table

| Route | Method | Purpose | Status Code | Response Structure |
|-------|--------|---------|-------------|-------------------|
| `/api/auth/login` | POST | Authenticate user by email | 200 / 404 / 500 | `{ success, data or error }` |
| `/api/auth/signup` | POST | Register new user | 201 / 400 / 500 | `{ success, data or error }` |
| `/api/users` | GET | Fetch all users (paginated) | 200 / 400 / 500 | `{ success, data, pagination }` |
| `/api/users/[id]` | GET | Fetch user by ID | 200 / 404 / 500 | `{ success, data or error }` |
| `/api/projects` | GET | Fetch all projects (paginated) | 200 / 400 / 500 | `{ success, data, pagination }` |
| `/api/projects` | POST | Create new project | 201 / 400 / 404 / 500 | `{ success, data or error }` |
| `/api/projects/[id]` | GET | Fetch project by ID | 200 / 404 / 500 | `{ success, data or error }` |
| `/api/projects/[id]` | PATCH | Update project fields | 200 / 400 / 404 / 500 | `{ success, data or error }` |
| `/api/projects/[id]` | DELETE | Delete project (cascades to tasks) | 200 / 404 / 500 | `{ success, data or error }` |
| `/api/projects/[id]/tasks` | GET | Fetch tasks for project (paginated) | 200 / 400 / 404 / 500 | `{ success, data, pagination }` |
| `/api/tasks` | POST | Create task under a project | 201 / 400 / 404 / 500 | `{ success, data or error }` |
| `/api/tasks/[id]` | PATCH | Update task fields | 200 / 400 / 404 / 500 | `{ success, data or error }` |
| `/api/tasks/[id]` | DELETE | Delete task | 200 / 404 / 500 | `{ success, data or error }` |

### Response Format Consistency

All endpoints follow a unified JSON response structure:

**Success Response (2xx):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-02T10:00:00Z",
    "updatedAt": "2026-02-02T10:00:00Z"
  }
}
```

**Error Response (4xx / 5xx):**
```json
{
  "success": false,
  "error": "Meaningful error message"
}
```

**List Response with Pagination:**
```json
{
  "success": true,
  "data": [
    { "id": "...", "title": "Project 1", "status": "IN_PROGRESS" },
    { "id": "...", "title": "Project 2", "status": "IDEA" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input, missing required fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

### Pagination & Query Parameters

List endpoints (`GET /api/projects`, `GET /api/users`, `GET /api/projects/[id]/tasks`) support pagination:

**Query Parameters:**
- `page` (integer, default: 1) – The page number to retrieve
- `limit` (integer, default: 10, max: 100) – Number of records per page

**Example Request:**
```bash
GET /api/projects?page=2&limit=20
```

**Pagination Metadata:**
The response includes metadata to help frontend pagination:
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 47,
    "pages": 3
  }
}
```

### Error Handling

All endpoints implement consistent error handling:

1. **Input Validation**: Missing or invalid fields return `400 Bad Request`
2. **Resource Not Found**: Non-existent IDs return `404 Not Found`
3. **Unexpected Errors**: Server-side errors return `500 Internal Server Error` with a generic message (stack traces are **never** exposed)
4. **No Data Leakage**: Errors never reveal database structure, raw queries, or sensitive information

### Sample cURL Requests & Responses

#### 1. Signup a New User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-123",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-02T10:30:00Z",
    "updatedAt": "2026-02-02T10:30:00Z"
  }
}
```

#### 2. Login a User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com" }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-123",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-02-02T10:30:00Z",
    "updatedAt": "2026-02-02T10:30:00Z"
  }
}
```

#### 3. Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water Quality Monitor",
    "description": "Real-time water quality monitoring for NGOs",
    "ownerId": "user-uuid-123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "project-uuid-456",
    "title": "Water Quality Monitor",
    "description": "Real-time water quality monitoring for NGOs",
    "status": "IDEA",
    "ownerId": "user-uuid-123",
    "createdAt": "2026-02-02T11:00:00Z",
    "updatedAt": "2026-02-02T11:00:00Z"
  }
}
```

#### 4. List Projects with Pagination
```bash
curl http://localhost:3000/api/projects?page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid-456",
      "title": "Water Quality Monitor",
      "description": "Real-time water quality monitoring for NGOs",
      "status": "IDEA",
      "ownerId": "user-uuid-123",
      "createdAt": "2026-02-02T11:00:00Z",
      "updatedAt": "2026-02-02T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### 5. Update Project Status
```bash
curl -X PATCH http://localhost:3000/api/projects/project-uuid-456 \
  -H "Content-Type: application/json" \
  -d '{ "status": "IN_PROGRESS" }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "project-uuid-456",
    "title": "Water Quality Monitor",
    "description": "Real-time water quality monitoring for NGOs",
    "status": "IN_PROGRESS",
    "ownerId": "user-uuid-123",
    "createdAt": "2026-02-02T11:00:00Z",
    "updatedAt": "2026-02-02T11:15:00Z"
  }
}
```

#### 6. Create Task for Project
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Set up hardware sensors",
    "description": "Install water quality sensors in target locations",
    "projectId": "project-uuid-456"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-789",
    "title": "Set up hardware sensors",
    "description": "Install water quality sensors in target locations",
    "status": "TODO",
    "projectId": "project-uuid-456",
    "createdAt": "2026-02-02T11:30:00Z",
    "updatedAt": "2026-02-02T11:30:00Z"
  }
}
```

#### 7. Error Example: Invalid Status
```bash
curl -X PATCH http://localhost:3000/api/projects/project-uuid-456 \
  -H "Content-Type: application/json" \
  -d '{ "status": "INVALID_STATUS" }'
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid status value"
}
```

### Reflection: Why Consistent Naming Matters

#### Predictability Reduces Onboarding Time
A frontend developer joining the team can immediately understand the API structure without needing extensive documentation. By following REST conventions (resources as nouns, plural, lowercase), developers can confidently guess endpoints they haven't seen before. For example, if they know `/api/projects` exists, they can reasonably assume `/api/projects/[id]` also exists for individual project operations.

#### Consistency Prevents Bugs
When the API follows predictable patterns, developers make fewer mistakes. By using standard HTTP methods (GET, POST, PATCH, DELETE) consistently, developers don't have to remember custom conventions. A unified response format ensures that frontend code can handle all responses with the same parsing logic, reducing context-switching errors and edge case handling.

#### Scalability Without Refactoring
As CollabLedger grows and new features are added (like comments, notifications, or collaboration), developers can extend the API in a predictable way:
- `/api/comments` for comment CRUD operations
- `/api/projects/[id]/comments` for project-specific comments
- `/api/notifications` for user notifications

The established patterns mean these additions won't feel out of place or require developers to learn new conventions, maintaining team velocity even as the API grows.

#### RESTful Design Reduces Cognitive Load
When endpoints follow REST conventions, developers don't need to memorize arbitrary URL structures or query parameter names. Every collection endpoint can be paginated with `?page=X&limit=Y`, every resource has a predictable URL structure, and HTTP methods have well-understood semantics. This clarity translates to fewer bugs and faster feature development.

## Local Running App Screenshot
![Local App Screenshot](./public/sprint1-localhost.png)

## Docker & Compose Setup for Local Development

This project is fully containerized using Docker and Docker Compose to ensure a consistent development environment across all team members' machines.

### 1. Dockerfile (Next.js Application)
We use a **multi-stage build** in our `Dockerfile` to optimize the final image size and security.
- **Stage 1 (Builder)**: This stage installs the full set of dependencies (including development tools) and runs `npm run build` to generate the production-ready `.next` folder.
- **Stage 2 (Runtime)**: This is the final image. We only copy the strictly necessary files (build artifacts and production dependencies) from the builder stage. This keeps the image lightweight and reduces the attack surface.

### 2. Docker Compose (Orchestration)
Our `docker-compose.yml` file manages three main services:
- **app**: The Next.js web application, which depends on the database and Redis cache.
- **db**: A PostgreSQL database container for persistent data storage.
- **redis**: A Redis container used for fast server-side caching.

#### Key Features:
- **Networks**: All services are connected via a shared bridge network (`collabledger-network`). This allows the app to communicate with the database using the hostname `db` and with Redis using the hostname `redis`.
- **Volumes**: We use a named volume (`postgres_data`) for the PostgreSQL container. This ensures that your data persists even if you stop or remove the containers.
- **Environment Variables**: Sensitive information like database credentials and connection strings are loaded from a `.env` file, which is ignored by Git for security.

### 3. Run & Verify Instructions

#### Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

#### How to start the environment:
1. **Initialize Environment Variables**:
   Copy the example environment file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. **Build and Launch**:
   Execute the following command to build the images and start the containers in the background:
   ```bash
   docker-compose up --build -d
   ```
3. **Verify Status**:
   Check if all containers are running successfully:
   ```bash
   docker ps
   ```

#### Expected Outcomes:
- **Web App**: Accessible at [http://localhost:3000](http://localhost:3000).
- **Database**: PostgreSQL is listening on port `5432`.
- **Cache**: Redis is listening on port `6379`.

---

## Reflection: Containerization & DevOps

**What challenges were faced while setting up Docker & Compose?**
The primary challenge was managing the multi-stage build effectively. Ensuring that all required folders (like `.next` and `node_modules`) were correctly copied from the `builder` to the `runtime` stage without bloating the image required careful planning. Additionally, configuring the correct internal networking hostnames (using `db` instead of `localhost` in the connection string) was a critical step for service communication.

**What worked well?**
Docker Compose worked exceptionally well for orchestrating the multi-container stack. Being able to spin up the entire application, database, and cache with a single command (`docker-compose up`) eliminates "it works on my machine" issues and significantly speeds up the onboarding process for new team members.

**What would be improved in future deployments?**
In future sprints, we would:
- **Infrastructure as Code (IaC)**: Use Terraform to manage cloud resources (like AWS RDS or Azure Database for PostgreSQL) to match our local container setup.
- **CI/CD Integration**: Fully automate the build and push process to a container registry (like ECR or Docker Hub) using GitHub Actions.
- **Standalone Mode**: Further optimize the Next.js target to `standalone` mode to reduce the container size even more.
## Understanding Cloud Deployments: Docker → CI/CD → AWS

This section explains how CollabLedger moves from a local development environment to a production-ready cloud infrastructure.

### 1. Dockerization: "It works on my machine"
Docker allows us to package the application, its environment, and its dependencies into a single "container". This ensures that the app runs exactly the same way on a developer's laptop as it does on an AWS server.

- **Dockerfile**: We use a multi-stage Dockerfile to keep the production image small. It installs dependencies, builds the Next.js app in "standalone" mode, and runs only the necessary files.
- **Docker Compose**: For local development, we use Compose to orchestrate three services:
  - `web`: The Next.js application.
  - `db`: A PostgreSQL database.
  - `redis`: A Redis instance for caching.

```yaml
# Simplified Dockerfile concept
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["node", "server.js"]
```

### 02. CI/CD Pipeline: The Automated Highway
Continuous Integration (CI) and Continuous Deployment (CD) automate the process of testing and shipping code. We use **GitHub Actions** for this.

**How our pipeline works:**
1. **Trigger**: Every time code is pushed to the `main` branch.
2. **Build & Test**: The pipeline installs dependencies, runs the linter to catch errors, and attempts to build the production application.
3. **Deploy (Simulated)**: If the build succeeds, it can be deployed to AWS.

### 3. Cloud Architecture on AWS
In a production scenario, CollabLedger would be deployed using the following AWS services:

```text
       [ User Browser ]
              | (HTTPS)
      [ AWS App Runner ]  <--- Runs our Docker Container
        /           \
[ AWS RDS (Postgres) ] [ AWS ElastiCache (Redis) ]
```

- **AWS App Runner**: A fully managed service that takes our Docker image and runs it, automatically scaling up or down based on traffic.
- **AWS RDS**: A managed PostgreSQL database that handles backups, patching, and scaling.
- **AWS ElastiCache**: Provides a managed Redis instance for fast data retrieval.

### 4. Secrets & Environment Management
Security is paramount when dealing with database credentials and API keys:
- **Local**: We use `.env.local` (ignored by Git) for local secrets.
- **CI/CD**: GitHub Secrets store sensitive keys (like `AWS_ACCESS_KEY`) used during the build process.
- **Production**: AWS Secrets Manager securely injects credentials into the running container at runtime, so they are never hardcoded in the codebase.

---

## Reflection: Infrastructure & Deployment

**What was challenging about containerization and deployment?**
The most challenging part of containerization was optimizing the Docker image size. Next.js can produce large images if not configured correctly. Using the "standalone" output mode and a multi-stage build in the `Dockerfile` was essential to strip away unnecessary `node_modules` and keep the image lightweight.

**What worked well?**
Docker Compose worked exceptionally well for local development. Instead of developers manually installing and configuring PostgreSQL and Redis, a single `docker-compose up` command creates a consistent environment for everyone. GitHub Actions also provided immediate feedback on whether new code breaks the build.

**What would be improved in a future deployment?**
In a future version of CollabLedger, we would:
1. **Infrastructure as Code (IaC)**: Use Terraform to automate the creation of AWS resources.
2. **Zero-Downtime Deployment**: Use blue-green deployments to ensure users never experience an outage during updates.
3. **Automated Migrations**: Integrate Prisma database migrations into the CI/CD pipeline so the database schema always matches the code.

---

## Global API Response Handler

### Overview

The Global API Response Handler ensures **all API responses** follow a **unified, predictable format**, improving developer experience, simplifying debugging, and enabling better observability.

### Unified Response Format

#### Success Response (200, 201)
```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

#### Error Response (400, 404, 500)
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE_IDENTIFIER"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### Implementation

**Core Files:**
- `src/lib/responseHandler.ts` - Exports `sendSuccess()` and `sendError()` functions
- `src/lib/errorCodes.ts` - Centralized error code definitions (17+ codes)

**Usage in Routes:**

```typescript
// src/app/api/projects/route.ts
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany();
    return sendSuccess(
      { projects, pagination: {...} },
      'Projects retrieved successfully',
      200
    );
  } catch (error) {
    return sendError(
      'Failed to retrieve projects',
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}
```

### Applied Routes

All routes using the Global API Response Handler:
- ✅ `GET/POST /api/projects` - List and create projects
- ✅ `POST /api/tasks` - Create tasks
- ✅ Consistent error handling with 400, 404, 500 status codes
- ✅ Machine-readable error codes for client-side error handling

### Error Codes

Standardized error codes for consistent error handling:
- **Validation (4xx)**: `VALIDATION_ERROR`, `INVALID_PAGINATION`, `INVALID_INPUT`, `MISSING_FIELD`
- **Not Found (4xx)**: `NOT_FOUND`, `PROJECT_NOT_FOUND`, `TASK_NOT_FOUND`, `USER_NOT_FOUND`
- **Database (5xx)**: `DATABASE_ERROR`, `DATABASE_OPERATION_FAILED`
- **Server (5xx)**: `INTERNAL_ERROR`, `INTERNAL_SERVER_ERROR`, `UNKNOWN_ERROR`

### Developer Experience Benefits

✅ **Consistency**: Every endpoint returns the same response shape
✅ **Less Boilerplate**: `sendSuccess(data)` instead of manual `NextResponse.json(...)`
✅ **Type Safety**: Full TypeScript support with generics
✅ **Easy Error Handling**: Clients use error codes programmatically
✅ **Automatic Timestamps**: ISO 8601 format for all responses

### Observability Benefits

✅ **Machine-Readable Error Codes**: Easy to aggregate and monitor errors
✅ **Timestamps**: Every response is timestamped for correlation and debugging
✅ **Security**: No sensitive details (stack traces, SQL) exposed to clients
✅ **Structured Logging**: Consistent format for monitoring tools (Sentry, Datadog, etc.)
✅ **Semantic Status Codes**: 400/404/500 indicate error type for automatic handling

### Documentation

For comprehensive implementation details, examples, and reflection on DX and observability, see:
- **[GLOBAL_API_RESPONSE_HANDLER.md](GLOBAL_API_RESPONSE_HANDLER.md)** - 470+ lines of detailed documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Verification checklist and examples
