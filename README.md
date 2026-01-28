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

## Local Running App Screenshot
![Local App Screenshot](./public/sprint1-localhost.png)
