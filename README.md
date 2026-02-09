# CollabLedger

> NGO Collaboration Platform - Eliminate duplicate work and accelerate social impact

CollabLedger is a modern web application built with Next.js 16 (App Router) that unifies NGO projects and open-source contributors in one shared workspace. Teams can discover active initiatives, align tasks, and deliver faster.

## 🚀 Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home/Landing page (public)
│   ├── login/               # Login page (public)
│   ├── signup/              # Sign up page (public)
│   ├── about/               # About page (public)
│   ├── dashboard/           # Dashboard (protected)
│   ├── projects/
│   │   └── [id]/           # Dynamic project detail (protected)
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── projects/       # Project CRUD
│   │   ├── tasks/          # Task management
│   │   └── users/          # User management
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # Custom 404 page
├── components/             # Reusable React components
├── lib/                    # Utility functions & configs
│   ├── auth.ts            # JWT utilities
│   ├── prisma.ts          # Database client
│   └── errorHandler.ts    # Error handling
├── middleware.ts          # Route protection middleware
└── types/                 # TypeScript type definitions
```

## 🛣️ Routing Architecture

### Route Map

#### **Public Routes** (No authentication required)
- `/` - Landing page showcasing CollabLedger features
- `/login` - User authentication
- `/signup` - New user registration
- `/about` - About the platform
- `/products` - Products/Features page

#### **Protected Routes** (Authentication required)
- `/dashboard` - User dashboard with project overview
- `/projects/[id]` - Dynamic route for individual project details
  - Example: `/projects/abc123` shows project with ID "abc123"
  - Fetches real data from `/api/projects/:id`
  - Displays project info, tasks, and collaboration options

### Route Protection Strategy

**Middleware-Based Protection** (`src/middleware.ts`)

The application uses Next.js middleware to protect routes at the edge:

1. **API Routes**: Token validation via `Authorization: Bearer <token>` header
2. **Page Routes**: Token validation via HTTP-only cookie (`auth_token`)

**Protection Flow:**
```
User visits /dashboard
    ↓
Middleware checks for auth_token cookie
    ↓
Cookie exists? → Verify JWT
    ↓
Valid token? → Allow access
    ↓
Invalid/Missing? → Redirect to /login?redirect=/dashboard
```

**Cookie Management:**
- Set on login: `auth_token` cookie with 7-day expiration
- Cleared on logout
- HTTP-only for security
- SameSite=Lax to prevent CSRF

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    User->>Login Page: Enter credentials
    Login Page->>API: POST /api/auth/login
    API->>Database: Verify user
    Database->>API: User data
    API->>Login Page: JWT token
    Login Page->>Browser: Set cookie + localStorage
    Login Page->>Dashboard: Redirect
    Dashboard->>Middleware: Request with cookie
    Middleware->>Dashboard: Access granted
```

## 🎨 Dynamic Routes

### `/projects/[id]` - Project Detail Page

**Features:**
- ✅ Real-time project data fetching from backend API
- ✅ Loading state with spinner
- ✅ Error handling for non-existent projects (404)
- ✅ Task list with status badges
- ✅ Owner-specific actions (only project owners can add tasks)
- ✅ Beautiful NGO-themed UI with animations

**Data Flow:**
```typescript
Page loads → Check auth → Fetch from /api/projects/:id
    ↓
Response handling:
  - 200: Display project
  - 404: Show "Project not found"
  - 401/403: Redirect to login
  - Other: Show error message
```

**Example Usage:**
```bash
# View project with ID "abc-123"
https://collabledger.app/projects/abc-123

# Backend API call made:
GET /api/projects/abc-123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚫 Custom 404 Page

Located at `src/app/not-found.tsx`

**Features:**
- Friendly NGO-themed error message
- Navigation shortcuts to Dashboard, Home, Login, and Signup
- Animated elements for better UX
- Fully responsive design

**Triggered when:**
- User visits a non-existent route (e.g., `/invalid-page`)
- Project with given ID doesn't exist
- Any unmatched route in the app

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/collabledger"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🧪 Testing Routes

### Test Public Access
```bash
# These should work without login
curl http://localhost:3000/
curl http://localhost:3000/login
curl http://localhost:3000/signup
```

### Test Protected Routes
```bash
# Without auth - should redirect to login
curl -I http://localhost:3000/dashboard

# With auth cookie - should return 200
curl -H "Cookie: auth_token=YOUR_JWT_TOKEN" http://localhost:3000/dashboard
```

### Test Dynamic Route
```bash
# Login first to get token
RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}')

TOKEN=$(echo $RESPONSE | jq -r '.data.token')

# Visit dynamic route
curl -H "Cookie: auth_token=$TOKEN" http://localhost:3000/projects/PROJECT_ID
```

### Test 404 Handling
```bash
# Visit non-existent route - should show custom 404
curl http://localhost:3000/this-does-not-exist
```

## 📊 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  role      UserRole @default(USER)
  projects  Project[]
}

model Project {
  id          String        @id @default(uuid())
  title       String
  description String
  status      ProjectStatus @default(IDEA)
  owner       User          @relation(fields: [ownerId], references: [id])
  ownerId     String
  tasks       Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  project     Project    @relation(fields: [projectId], references: [id])
  projectId   String
}
```

## 🎯 SEO & Performance Benefits

### Next.js App Router Advantages

1. **Server-Side Rendering (SSR)**
   - Dynamic project pages rendered on server
   - Better SEO for project listings
   - Faster initial page load

2. **Automatic Code Splitting**
   - Each route loads only required JavaScript
   - `/projects/[id]` bundle separate from dashboard
   - Improved performance and reduced bandwidth

3. **Metadata API**
   - Dynamic meta tags per project
   - Better social media sharing
   - Improved search engine indexing

4. **Streaming & Suspense**
   - Progressive page rendering
   - Loading states while data fetches
   - Better perceived performance

### Route-Level Optimizations

```typescript
// Example: Dynamic metadata for project pages
export async function generateMetadata({ params }) {
  const project = await fetchProject(params.id);
  return {
    title: `${project.title} | CollabLedger`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
    },
  };
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add DATABASE_URL, JWT_SECRET, etc.
```

### Environment-Specific Builds

```bash
# Staging
npm run build:staging

# Production
npm run build:production
```

## 📝 Reflection: Routing & SEO

### Key Learnings

**1. App Router vs Pages Router**

The Next.js App Router provides significant improvements:
- **File-based routing** makes structure intuitive (`app/projects/[id]/page.tsx`)
- **Nested layouts** reduce code duplication
- **Server components by default** improve initial load performance
- **Streaming** enables progressive page rendering

**2. Route Protection Implementation**

Implementing middleware-based protection taught us:
- **Edge middleware** runs before page rendering, reducing server load
- **Cookie-based auth** is more secure than localStorage for server-side validation
- **Redirect preservation** (`?redirect=/dashboard`) improves UX after login

**3. Dynamic Routes Best Practices**

Building `/projects/[id]`:
- **Loading states** are crucial for perceived performance
- **Error boundaries** prevent crashes from bad data
- **404 handling** must be graceful and actionable
- **TypeScript params** ensure type safety (`params.id as string`)

**4. SEO Benefits Realized**

- **Server-rendered dynamic routes** ensure search engines can crawl project pages
- **Custom 404 pages** reduce bounce rate
- **Metadata API** enables per-page SEO optimization
- **Fast page transitions** improve Core Web Vitals

### Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Cookie not accessible in middleware | Set cookie with `path=/` and proper SameSite |
| Protected routes still accessible | Updated middleware matcher to include page routes |
| Dynamic route params type safety | Used `useParams()` with TypeScript assertion |
| 404 page styling inconsistency | Created custom not-found.tsx with brand styling |

### Future Improvements

- [ ] Implement ISR (Incremental Static Regeneration) for project pages
- [ ] Add parallel routes for modals
- [ ] Implement intercepting routes for task creation
- [ ] Add route groups for better organization
- [ ] Implement middleware caching for JWT verification

## 🤝 Contributing

Contributions are welcome! This project demonstrates:
- Modern Next.js routing patterns
- Secure authentication flows
- Dynamic route implementation
- SEO-friendly architecture

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the NGO community**
