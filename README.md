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
