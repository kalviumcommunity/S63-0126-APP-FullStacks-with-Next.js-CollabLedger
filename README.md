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

## Environment Variable Management

This project implements secure environment variable management following Next.js best practices. Environment variables are essential for:
- Separating configuration from code
- Managing secrets and credentials safely
- Supporting different environments (local, staging, production)
- Protecting sensitive data from exposure to the browser

### Server-Side vs Client-Side Variables

#### Server-Side Variables (Private)
Server-side variables are only accessible on the server and are **never** exposed to the browser. Use these for sensitive data:

```
DATABASE_URL=postgresql://...
API_SECRET=secret_key_...
PRIVATE_API_KEY=...
```

**Where to use:**
- API routes (`src/app/api/`)
- Server components (files marked with `'use server'`)
- Server utilities (e.g., `src/lib/env.server.ts`)

**Example:**
```typescript
// ✓ SAFE: Server component or API route
import { getDatabaseUrl } from '@/lib/env.server';

export default async function MyServerComponent() {
  const dbUrl = getDatabaseUrl();
  // Use DATABASE_URL only on the server
  return <div>Data loaded from secure database</div>;
}
```

#### Client-Side Variables (Public - NEXT_PUBLIC_)
Client-side variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser. These are:
- Compiled into the JavaScript bundle at build time
- Visible in the browser's network requests and source code
- **Only safe for non-sensitive data** (API endpoints, analytics IDs, etc.)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX
```

**Where to use:**
- Client components (default in App Router)
- Server components (also compiled at build time)
- Browser console and network requests

**Example:**
```typescript
// ✓ SAFE: Public API endpoint, accessible in browser
'use client';

import { getApiBaseUrl } from '@/lib/env.client';

export default function MyClientComponent() {
  const apiUrl = getApiBaseUrl();
  // This is fine because it's just a URL, not a secret
  
  const handleFetch = async () => {
    const response = await fetch(`${apiUrl}/products`);
    return response.json();
  };

  return <button onClick={handleFetch}>Load Products</button>;
}
```

### The NEXT_PUBLIC_ Prefix Explained

Next.js replaces all `NEXT_PUBLIC_` variables with their values at **build time**. This means:
- ✓ `NEXT_PUBLIC_API_BASE_URL` → Replaced with `http://localhost:3000/api` in the bundle
- ✗ `DATABASE_URL` → Not included in the bundle (server-only)

**Security Rule:**
> Never prefix sensitive data with `NEXT_PUBLIC_`. If it starts with `NEXT_PUBLIC_`, assume it will be visible to the browser.

### Getting Started with Environment Variables

1. **Copy the template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your local values:**
   ```env
   # .env.local
   DATABASE_URL=postgresql://user:password@localhost:5432/mydb
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```

3. **Access in code:**
   ```typescript
   // Server-side
   const dbUrl = process.env.DATABASE_URL;

   // Client-side (only NEXT_PUBLIC_ variables)
   const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
   ```

4. **Restart the dev server** after adding new environment variables:
   ```bash
   npm run dev
   ```

### File Structure for Environment Management

```
project-root/
├── .env.example          # ✓ Committed: Template with placeholders
├── .env.local            # ✗ Not committed: Local development secrets
├── .env.staging          # ✗ Not committed: Staging environment config
├── .env.production       # ✗ Not committed: Production config
├── .gitignore            # Contains: .env* and !.env.example
└── src/lib/
    ├── env.server.ts     # Server-side variable utilities
    └── env.client.ts     # Client-side variable utilities
```

### Common Pitfalls Avoided

#### 1. Exposing Server Secrets to the Browser
```typescript
// ✗ WRONG: Using server secret in client component
'use client';
const apiKey = process.env.API_SECRET; // undefined in browser!

// ✓ CORRECT: Use server-only in API route
// src/app/api/example/route.ts
export async function POST(request: Request) {
  const apiKey = process.env.API_SECRET; // Safe on server
  // ... use apiKey ...
}
```

#### 2. Forgetting NEXT_PUBLIC_ Prefix
```typescript
// ✗ WRONG: Client won't have access
const apiUrl = process.env.API_BASE_URL; // undefined

// ✓ CORRECT: Add prefix
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // works
```

#### 3. Using Environment Variables Conditionally
```typescript
// ✗ WRONG: Dynamic access doesn't work with build-time replacement
const key = isDev ? 'DEV_KEY' : 'PROD_KEY';
const value = process.env[key]; // undefined!

// ✓ CORRECT: Static access
const value = isDev 
  ? process.env.NEXT_PUBLIC_DEV_KEY 
  : process.env.NEXT_PUBLIC_PROD_KEY;
```

#### 4. Assuming .env.local Persists After Rebuild
Environment variables are loaded once at startup. After changing `.env.local`:
1. Restart the development server
2. Changes apply to new code, but existing in-memory values don't update
3. Browser must reload to see new `NEXT_PUBLIC_` values

### Deployment Considerations

**For production deployment:**
1. Set environment variables in your hosting platform (Vercel, Netlify, AWS, etc.)
2. Do NOT commit `.env.local` or `.env.production` to version control
3. Use `.env.example` to document required variables for your team
4. Add validation at startup to catch missing variables early

**Example Validation (in `src/app/layout.tsx`):**
```typescript
import { validateServerEnv } from '@/lib/env.server';

// This runs once when the server starts
if (typeof window === 'undefined') {
  validateServerEnv();
}
```

## Team Branching & PR Workflow

## Database Migrations & Seed Scripts

This project uses Prisma to manage the database schema and initial test data. Prisma migrations provide a repeatable, reviewable history of schema changes and allow the team to apply the same changes across environments.

- **Why use Prisma migrations:**
   - They produce SQL migrations that are source-controlled, reviewable in PRs, and can be applied consistently in CI/staging/production.
   - Migrations keep schema changes explicit and reversible during development workflows.

- **Run migrations (development):**

```bash
# create a migration from `schema.prisma` and apply it to your dev DB
npx prisma migrate dev --name descriptive_name
```

- **Reset local database (destructive — use only in dev):**

```bash
# drops local data, reapplies migrations, and runs the seed script
npx prisma migrate reset --force
```

- **Seed script:**
   - The seed script lives at `prisma/seed.ts` and uses `prisma.user.upsert(...)` to insert or update initial records. Because it uses `upsert` keyed on unique fields (e.g. `email`), running the seed repeatedly is safe (idempotent) and won't create duplicate rows.
   - Run the seed via the Prisma-configured command:

```bash
npx prisma db seed
```

   - Or run directly (the project uses an ESM-friendly loader):

```bash
node --loader ts-node/esm prisma/seed.ts
```

- **How environment variables are used securely:**
   - The database connection string is read from `DATABASE_URL` in the environment (see `.env.example`).
   - Keep `.env.local` and other environment files out of version control. Only commit `.env.example` with placeholders so teammates know which variables to provide.

- **Production safety & team workflow:**
   - Commit generated migration files under `prisma/migrations/` so reviewers can inspect SQL before applying to staging/production.
   - Apply migrations to a staging environment before production. Test migrations against a recent production snapshot when possible.
   - Avoid running destructive commands (e.g., `prisma migrate reset`) against production. Use backups and CI-run, audited deployment steps for production schema changes.
   - The idempotent seed helps developers get a consistent local environment without polluting data in shared environments.

If you'd like, add a small CI step that runs `npx prisma migrate deploy` against a staging database as part of release validation.

This section documents the professional GitHub workflow used by the CollabLedger team to ensure high code quality, smooth collaboration, and scalable development practices.

### Branch Naming Conventions

All branches should follow these naming patterns to maintain clarity and organization:

#### Feature Branches: `feature/<feature-name>`
For new features or enhancements.
```bash
git checkout -b feature/user-dashboard
git checkout -b feature/add-notification-system
git checkout -b feature/improve-performance
```

#### Bug Fix Branches: `fix/<bug-name>`
For bug fixes and corrections.
```bash
git checkout -b fix/login-redirect-issue
git checkout -b fix/memory-leak-in-api
git checkout -b fix/typo-in-help-text
```

#### Chore Branches: `chore/<task-name>`
For maintenance, dependencies, refactoring, and non-feature work.
```bash
git checkout -b chore/update-dependencies
git checkout -b chore/refactor-auth-module
git checkout -b chore/remove-dead-code
```

#### Documentation Branches: `docs/<update-name>`
For documentation updates and README changes.
```bash
git checkout -b docs/api-endpoints-guide
git checkout -b docs/setup-instructions
git checkout -b docs/contributing-guide
```

**Branch Naming Best Practices:**
- Use lowercase letters only (except hyphens)
- Use hyphens to separate words (not underscores)
- Be descriptive but concise (max 50 characters recommended)
- Use the issue number if applicable: `feature/user-dashboard-123`

### Pull Request Workflow

#### Step 1: Create a Descriptive PR
When creating a pull request:
1. Use the provided [pull request template](.github/pull_request_template.md)
2. Link the related issue (e.g., `Closes #123`)
3. Write a clear summary explaining what changed and why
4. Provide screenshots/evidence for UI changes

#### Step 2: Ensure Code Quality Checks Pass
Before requesting review, ensure:
- ✓ Code builds: `npm run build`
- ✓ No TypeScript errors: `npx tsc --noEmit`
- ✓ Linting passes: `npm run lint` (if configured)
- ✓ Tests pass: `npm run test` (if applicable)
- ✓ No console errors or warnings in development

#### Step 3: Request Review from Teammates
- Request at least one code review before merging
- Assign the PR to relevant team members
- Add labels (bug, feature, documentation, etc.)
- Mention reviewers if they don't get notified automatically

#### Step 4: Address Feedback
- Respond to all comments respectfully
- Make requested changes in follow-up commits (don't force push if in active review)
- Re-request review after addressing feedback
- Discuss disagreements constructively; escalate if needed

#### Step 5: Merge to Main
Once approved:
1. Ensure branch is up-to-date with `main`
2. Use "Squash and merge" for feature branches (keeps history clean)
3. Use "Create a merge commit" for important structural changes
4. Delete the branch after merging
5. Verify deployment to staging/production

### Code Review Checklist for Reviewers

Reviewers should verify all items before approving:

#### Code Quality
- [ ] Code is clean, readable, and follows project conventions
- [ ] Variable and function names are descriptive
- [ ] No unnecessary complexity or duplication
- [ ] Comments explain "why," not "what"
- [ ] No debug code or console.logs left behind

#### Functionality & Testing
- [ ] Changes work as described in the PR
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No new console errors or warnings
- [ ] Tests cover new functionality

#### TypeScript & Type Safety
- [ ] No `any` types without justification
- [ ] Types are properly defined for function parameters and returns
- [ ] Type errors are resolved
- [ ] Generics are used appropriately

#### Documentation & Accessibility
- [ ] Comments are clear and helpful
- [ ] README updated if needed (especially for public APIs)
- [ ] Environment variables documented (if new ones added)
- [ ] UI changes meet accessibility standards (WCAG 2.1 AA)
- [ ] Component props are documented

#### Security & Performance
- [ ] No hardcoded secrets or credentials
- [ ] Environment variables used correctly (no `NEXT_PUBLIC_` on secrets)
- [ ] No SQL injection or XSS vulnerabilities
- [ ] Database queries are optimized
- [ ] API calls are efficient (no N+1 queries)

#### Next.js Specific
- [ ] Server components are used for sensitive operations
- [ ] Client components use `'use client'` when needed
- [ ] Proper use of dynamic rendering vs static generation
- [ ] Image optimization used where applicable
- [ ] No unnecessary re-renders or state management

### Workflow Benefits & Reflection

This structured team workflow provides significant value across multiple dimensions:

#### 1. **Code Quality & Reliability**
- **Mandatory Code Reviews:** Every change is reviewed by at least one teammate before merging, catching bugs and design issues early
- **Clear Conventions:** Consistent branch naming and PR structure reduce confusion and make the git history readable
- **Automated Validation:** Build, lint, and type checks ensure code meets standards before human review
- **Result:** Fewer bugs reach production, lower technical debt, more maintainable codebase

#### 2. **Team Collaboration & Knowledge Sharing**
- **Peer Learning:** Reviews expose team members to different approaches and improvements
- **Documented Context:** PR descriptions and comments create a historical record of design decisions
- **Distributed Responsibility:** No single person is a bottleneck; multiple team members understand each feature
- **Result:** Stronger team, faster onboarding for new developers, collective code ownership

#### 3. **Scalability & Project Growth**
- **Modular Changes:** Feature branches isolate work, making it easier to manage multiple parallel features
- **Easy Rollback:** If issues arise, reverting a single PR is cleaner than debugging merged code
- **Clear Git History:** Well-structured commits and branches make it easy to track when and why changes occurred
- **Result:** The codebase scales gracefully without becoming chaotic; large teams can work without stepping on each other

#### 4. **Professional Standards & Best Practices**
- **Industry Alignment:** This workflow matches practices used by major tech companies (Google, GitHub, Netflix)
- **Consistency:** All changes follow the same process, reducing friction
- **Documentation:** PR templates and this guide ensure expectations are clear
- **Result:** Professional development practices that clients and partners respect; easier hiring of experienced developers

#### 5. **Continuous Improvement**
- **Feedback Loop:** Code reviews are opportunities to discuss improvements, not just catch bugs
- **Pattern Recognition:** Over time, the team identifies best practices and incorporates them into standards
- **Metrics & Insights:** Git history provides data on team velocity, common issues, and improvement areas
- **Result:** The team's engineering practices improve continuously

### Quick Reference

**Create and push a new feature:**
```bash
# Create a new feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature-name

# Make your changes, commit, and push
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature-name
```

**Create a Pull Request:**
1. Push your branch to GitHub
2. Go to the repository and click "New Pull Request"
3. Select your branch and `main` as the target
4. Fill out the PR template with all required information
5. Request review from teammates
6. Wait for approvals before merging

**Handling Merge Conflicts:**
```bash
# Update your branch with latest main
git fetch origin
git rebase origin/main

# Resolve conflicts in your editor, then:
git add .
git rebase --continue
git push origin feature/your-feature-name -f
```

