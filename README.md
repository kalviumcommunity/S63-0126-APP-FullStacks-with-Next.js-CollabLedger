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

