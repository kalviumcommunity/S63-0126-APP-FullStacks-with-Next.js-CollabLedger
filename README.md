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

## 📋 Form Validation & State Management

CollabLedger implements robust form validation using **React Hook Form** and **Zod** for type-safe schema validation.

### Form Validation Stack

- **React Hook Form**: Manages form state, validation, and submission
- **Zod**: Type-safe schema validation
- **@hookform/resolvers**: Connects Zod schemas to React Hook Form

### Installation

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Validation Schema Architecture

Zod schemas define validation rules and TypeScript types in a single source of truth:

**Example: Signup Schema** (`src/schemas/signupSchema.ts`)

```typescript
import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
```

**Key Features:**
- ✅ String length validation
- ✅ Email format validation
- ✅ Password confirmation matching
- ✅ Automatic TypeScript type generation
- ✅ Custom error messages

### React Hook Form Integration

**Example: Signup Page** (`src/app/signup/page.tsx`)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/schemas/signupSchema";

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<SignupFormData>({
  resolver: zodResolver(signupSchema),
});
```

**Benefits:**
- Client-side validation before API calls
- Real-time error feedback
- Prevents invalid form submissions
- Type-safe form data

### Reusable Form Components

**FormInput Component** (`src/components/FormInput.tsx`)

```typescript
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  register,
  error,
}: FormInputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="block mb-1 font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        aria-invalid={!!error}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

**Usage:**
```tsx
<FormInput 
  label="Name" 
  name="name" 
  register={register} 
  error={errors.name?.message} 
/>
```

**Advantages:**
- ✅ Consistent styling across forms
- ✅ Built-in error display
- ✅ Accessibility features (ARIA labels)
- ✅ Reduces code duplication
- ✅ Easy to maintain and update

### Accessibility Features

Our form implementation prioritizes accessibility:

1. **Semantic HTML**
   - `<label>` elements properly linked to inputs via `htmlFor`
   - Descriptive label text for screen readers

2. **ARIA Attributes**
   - `aria-invalid={!!error}` indicates validation state
   - Screen readers announce errors automatically

3. **Keyboard Navigation**
   - Full keyboard support (Tab, Enter, Escape)
   - Focus visible indicators
   - Logical tab order

4. **Visual Feedback**
   - Error messages displayed below fields
   - Red text for errors
   - Disabled state for submit button during submission

### Validation Flow

```mermaid
sequenceDiagram
    User->>Form: Enter data
    Form->>React Hook Form: Track field changes
    User->>Form: Submit
    React Hook Form->>Zod: Validate data
    alt Valid Data
        Zod->>React Hook Form: Pass
        React Hook Form->>API: Submit data
        API->>User: Success
    else Invalid Data
        Zod->>React Hook Form: Errors
        React Hook Form->>Form: Display errors
        Form->>User: Show validation messages
    end
```

### Validation Examples

**Scenario Testing:**

1. **Empty Fields** → "Name must be at least 3 characters long"
2. **Invalid Email** → "Please enter a valid email address"
3. **Short Password** → "Password must be at least 6 characters long"
4. **Password Mismatch** → "Passwords do not match"
5. **Valid Data** → Form submits successfully

**Console Success Output:**
```
Form Submitted: { 
  name: "Alice Johnson", 
  email: "alice@example.com", 
  password: "secure123" 
}
```

### Why This Approach?

**Scalability:**
- Easy to add new forms with consistent validation
- Reusable components reduce development time
- Centralized validation logic

**Type Safety:**
- Zod generates TypeScript types automatically
- Compile-time error detection
- Better IDE autocomplete

**User Experience:**
- Instant validation feedback
- Clear error messages
- Prevents invalid submissions
- Accessible to all users

**Maintainability:**
- Single source of truth for validation rules
- Easy to update validation logic
- Testable schemas and components

---

## � UI Feedback System

CollabLedger implements a comprehensive feedback system that keeps users informed about their actions through **toasts**, **modals**, and **loading indicators**. This system ensures a responsive, accessible, and user-friendly experience.

### 🎯 Feedback Patterns

| Feedback Type | Use Case | UI Element | Example |
|---------------|----------|------------|---------|
| **Instant Feedback** | Success/error notifications | Toast (Sonner) | "Project created successfully!" |
| **Blocking Feedback** | Destructive confirmations | Modal Dialog | "Are you sure you want to delete?" |
| **Process Feedback** | Async operations | Loading overlays/spinners | "Loading your dashboard..." |

### 📚 Library Stack

```bash
# Toast notifications
sonner                    # Modern, accessible toast library

# Modal/Dialog components
@headlessui/react        # Accessible modal primitives with focus management

# Icons
lucide-react            # Beautiful icon library for spinners, actions
```

### 🎨 Component Architecture

#### **Toast System** (`src/lib/toastHelpers.ts`)

**Helper Functions:**
```typescript
showSuccessToast(message: string)      // Green success toast
showErrorToast(message: string)        // Red error toast  
showInfoToast(message: string)         // Blue info toast
showLoadingToast(message: string)      // Loading toast with spinner
dismissToast(toastId: string)          // Dismiss specific toast
showErrorToastFromError(error: unknown) // Auto-parse error messages
withToast(operation, { loading, success, error }) // Async wrapper
```

**Global Setup** ([src/app/layout.tsx](src/app/layout.tsx#L38-L44)):
```tsx
<Toaster 
  position="bottom-right" 
  expand={false}
  richColors 
  closeButton
  duration={4000}  // Auto-dismiss after 4 seconds
/>
```

#### **Modal Components**

**Base Modal** ([src/components/modals/BaseModal.tsx](src/components/modals/BaseModal.tsx)):
- Built with Headless UI `Dialog` primitive
- Focus trap prevents Tab from leaving modal
- Escape key to close
- Click outside overlay to dismiss
- Smooth enter/exit transitions
- Accessible: `aria-modal`, `aria-labelledby`, `aria-describedby`

**Confirm Dialog** ([src/components/modals/ConfirmDialog.tsx](src/components/modals/ConfirmDialog.tsx)):
- Reusable confirmation pattern
- Variants: `danger` (red) | `info` (blue)
- Promise-based API via `useConfirm` hook
- Loading state support

**Form Modals:**
- [CreateProjectModal](src/components/modals/CreateProjectModal.tsx) - Create new projects
- [CreateTaskModal](src/components/modals/CreateTaskModal.tsx) - Add tasks to projects
- [EditProjectModal](src/components/modals/EditProjectModal.tsx) - Update project details
- [EditTaskModal](src/components/modals/EditTaskModal.tsx) - Update task information

#### **Loading Indicators**

**Spinner** ([src/components/ui/Spinner.tsx](src/components/ui/Spinner.tsx)):
```tsx
<Spinner size="sm" | "md" | "lg" label="Loading..." />
```
- Accessible with `role="status"` and `aria-live="polite"`
- Animated lucide-react `Loader2` icon

**LoadingOverlay** ([src/components/ui/LoadingOverlay.tsx](src/components/ui/LoadingOverlay.tsx)):
```tsx
<LoadingOverlay message="Loading project..." fullScreen={true} />
```
- Full-screen or relative positioning
- Backdrop blur effect
- Prevents interaction during loading

### 🔧 Integration Points

#### **Authentication Flows**

**Login** ([src/app/login/page.tsx](src/app/login/page.tsx)):
- ❌ Error toast: Invalid credentials, network errors
- ✅ Success toast: "Welcome back! Redirecting to dashboard..."

**Signup** ([src/app/signup/page.tsx](src/app/signup/page.tsx)):
- ❌ Error toast: Validation errors, duplicate email
- ✅ Success toast: "Account created successfully! Redirecting..."

#### **Dashboard** ([src/app/dashboard/page.tsx](src/app/dashboard/page.tsx))

**Modals:**
- "Create New Project" button → `CreateProjectModal`
- Logout button → Confirm dialog: "Are you sure you want to logout?"

**Toasts:**
- ✅ Project created successfully
- ✅ Logged out successfully
- ❌ Data fetch failures (shown automatically, non-blocking)

**Loading:**
- Full-screen `LoadingOverlay` during initial data fetch

#### **Project Detail** ([src/app/projects/[id]/page.tsx](src/app/projects/[id]/page.tsx))

**Modals:**
- "Add Task" button → `CreateTaskModal`
- Edit task icon → `EditTaskModal` (pre-filled)
- Delete task icon → Confirm dialog: "Are you sure you want to delete this task?"
- Edit project button → `EditProjectModal`
- Delete project button → Confirm dialog with danger variant

**Toasts:**
- ✅ Task created successfully
- ✅ Task updated successfully  
- ✅ Task deleted successfully
- ✅ Project updated successfully
- ✅ Project deleted successfully
- ❌ API errors with user-friendly messages

**Loading:**
- Full-screen overlay during project data fetch

### ♿ Accessibility Features

**Keyboard Navigation:**
- `Tab` / `Shift+Tab` to navigate modal elements
- `Escape` to close modals
- Focus trap keeps keyboard focus within modal
- Focus restoration when modal closes

**Screen Reader Support:**
- Toast announcements via `aria-live="polite"` (non-intrusive)
- Modal labels with `aria-labelledby` and `aria-describedby`
- Loading indicators with `role="status"`
- Button labels with `aria-label`

**Visual Feedback:**
- Color-coded toasts (green=success, red=error, blue=info)
- Smooth transitions (300ms) for modals
- Backdrop blur reduces cognitive load
- Loading spinners with clear messages

### 🎯 UX Principles Followed

1. **Non-Intrusive Notifications**: Toasts appear in bottom-right, auto-dismiss, don't block interaction
2. **Clear Feedback**: Every user action gets immediate visual confirmation
3. **Prevent Errors**: Confirm dialogs for destructive actions (delete project/task)
4. **Maintain Context**: Loading overlays preserve page state, modals close on success
5. **Accessible by Default**: All components use semantic HTML and ARIA attributes

### 🧪 Developer Guide

**Using Toasts:**
```tsx
import { showSuccessToast, showErrorToast } from '@/lib/toastHelpers';

// Simple success
showSuccessToast('Changes saved!');

// Error from catch block
try {
  await api.call();
} catch (error) {
  showErrorToastFromError(error); // Auto-parses error message
}

// Async wrapper with loading/success/error
await withToast(
  () => createProject(data),
  {
    loading: 'Creating project...',
    success: 'Project created!',
    error: 'Failed to create project'
  }
);
```

**Using Confirm Dialog:**
```tsx
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';

function MyComponent() {
  const { confirm, confirmProps } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });

    if (confirmed) {
      // User clicked "Delete"
      await deleteItem();
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <ConfirmDialog {...confirmProps} />
    </>
  );
}
```

**Using Form Modals:**
```tsx
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState('user-id');
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Create Project</button>
      <CreateProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          // Refresh project list
          fetchProjects();
        }}
        ownerId={userId}
      />
    </>
  );
}
```

### 🔍 Error Handling

**Global Error Boundary** ([src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx)):
- Catches React errors and prevents app crash
- Logs errors via `logger.ts`
- Shows toast notification: "An unexpected error occurred"
- Displays fallback UI with "Refresh Page" and "Go Back" options
- Development mode shows error stack trace

**Error Message Parsing:**
- Backend errors are parsed from API response `message` field
- Network errors show user-friendly fallback: "An error occurred. Please try again."
- Validation errors displayed inline (forms) or via toast (API responses)

### 📸 Visual Examples

**Toast Notifications:**
- Success (green): "✓ Project created successfully!"
- Error (red): "✗ Failed to delete task"
- Info (blue): "ℹ Processing your request..."
- Loading (spinner): "⏳ Saving changes..."

**Modal Patterns:**
- Create/Edit: Form with Cancel + Submit buttons
- Confirm Delete: Warning icon + danger-styled Confirm button
- Error fallback: Error icon + Refresh + Go Back actions

### 🚀 Future Enhancements

- **Undo functionality** for destructive actions
- **Optimistic updates** (update UI before API response)
- **Persistent toast queue** (show multiple toasts sequentially)
- **Dark mode support** for all feedback components
- **Custom toast positions** per use case
- **Progress bars** for long-running operations (file uploads)

---

## �🎨 Dynamic Routes

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

## Centralized Error Handling Middleware

### Overview

Centralized error handling is a critical component of production-ready applications. Rather than scattering try-catch logic across every API route, CollabLedger implements a unified error handling layer that:

- **Detects environment** (development vs. production)
- **Returns detailed errors with stack traces** in development for fast debugging
- **Returns safe, minimal errors** in production to prevent information leakage
- **Logs full error details** internally using a structured logger
- **Maintains consistent response format** across all endpoints

This approach eliminates repetitive error handling code, improves maintainability, and enhances security by preventing sensitive information from being exposed to clients.

### Folder Structure Overview

```
src/lib/
├── errorHandler.ts      # Centralized error handling logic
├── logger.ts            # Structured JSON logging
├── responseHandler.ts   # Unified success/error response formatting
├── errorCodes.ts        # Standardized error code definitions
└── prisma.ts            # Database client singleton
```

**Key Relationships:**
- `errorHandler.ts` uses `logger.ts` to log all errors
- `errorHandler.ts` returns `NextResponse` with consistent formatting
- Routes import `handleError()` and `handleValidationError()` helpers
- All errors are categorized with codes from `errorCodes.ts`

### Implementation: logger.ts

The structured logger ensures all error information is captured in a machine-readable JSON format suitable for log aggregation services like Datadog, Splunk, or CloudWatch.

**Key Features:**
- Logs in JSON format for easy parsing by aggregation services
- Environment-aware: includes stack traces in development only
- Structured context: route names, user IDs, and custom metadata
- ISO 8601 timestamps for precise correlation

**Example Development Log Output:**
```json
{
  "level": "error",
  "message": "API Error: Database operation failed",
  "context": {
    "route": "/api/users",
    "method": "GET",
    "page": 1,
    "limit": 10
  },
  "timestamp": "2026-02-02T10:30:45.123Z",
  "stack": "Error: Connection timeout\n    at Database.query (src/lib/prisma.ts:45:23)\n    ..."
}
```

**Example Production Log Output (no stack trace):**
```json
{
  "level": "error",
  "message": "API Error: Database operation failed",
  "context": {
    "route": "/api/users",
    "method": "GET"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### Implementation: errorHandler.ts

The error handler provides utility functions that detect error types, map them to standard error codes, and return appropriately detailed responses based on the environment.

**Core Functions:**
- `handleError(error, context)` - Main error handler for unexpected exceptions
- `handleValidationError(message, context)` - For input validation failures
- `handleNotFound(resourceType, context)` - For 404 not found scenarios

**Features:**
- Automatic error type detection (Prisma, validation, generic)
- Environment-aware response details (detailed in dev, minimal in prod)
- Structured logging of all errors
- Consistent error codes for client handling

### Usage in API Routes

**Before (Without Centralized Error Handling):**
```typescript
// ❌ Repetitive error handling scattered across routes
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);  // Inconsistent logging
    return NextResponse.json(
      { success: false, error: 'Internal server error' },  // Generic message
      { status: 500 }
    );
  }
}
```

**After (With Centralized Error Handling):**
```typescript
// ✅ Clean, consistent error handling
import { handleError, handleValidationError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const context = { route: '/api/users', method: 'GET' };

  try {
    const users = await prisma.user.findMany();
    logger.info('Users retrieved successfully', {
      route: context.route,
      totalCount: users.length,
    });
    return sendSuccess(users, 'Users retrieved successfully', 200);
  } catch (error) {
    return handleError(error, context);  // One line handles everything
  }
}
```

### Error Response Comparison Table

| Aspect | Development | Production |
|--------|-------------|-----------|
| **Error Message** | Detailed (e.g., "Connection timeout at query()") | Generic (e.g., "Database operation failed") |
| **Stack Trace** | ✅ Included in `error.details` field | ❌ Not included |
| **Internal Context** | ✅ Logged with full error object | ✅ Logged internally only |
| **User Sees** | Full details for debugging | Safe, minimal message |
| **Security Risk** | None (local development only) | Prevented (no leakage) |
| **Logging** | Full stack traces in logs | Full stack traces in logs (internal only) |

### Example Error Responses

**Development Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Email is required and must be a string"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

**Production Response (Same Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

**Development Response (500 - Database Error):**
```json
{
  "success": false,
  "message": "Database operation failed",
  "error": {
    "code": "DATABASE_ERROR",
    "details": "PrismaClientKnownRequestError: The 'users' table does not exist."
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

**Production Response (Same Request):**
```json
{
  "success": false,
  "message": "Database operation failed",
  "error": {
    "code": "DATABASE_ERROR"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### Applied Routes (All Using Centralized Error Handling)

All API routes have been updated to use the centralized error handler:

- ✅ `POST /api/auth/signup` - User registration
- ✅ `POST /api/auth/login` - User authentication
- ✅ `GET /api/users` - List users with pagination
- ✅ `GET /api/users/[id]` - Retrieve user by ID
- ✅ `GET /api/projects` - List projects
- ✅ `POST /api/projects` - Create project
- ✅ `GET /api/projects/[id]` - Retrieve project
- ✅ `PATCH /api/projects/[id]` - Update project
- ✅ `DELETE /api/projects/[id]` - Delete project
- ✅ `GET /api/projects/[id]/tasks` - List project tasks
- ✅ `POST /api/tasks` - Create task
- ✅ `PATCH /api/tasks/[id]` - Update task
- ✅ `DELETE /api/tasks/[id]` - Delete task

### Reflection: Benefits & Extensibility

#### Debugging Benefits

**Faster Root Cause Analysis:**
With structured logging, developers can immediately identify what went wrong:
- The `level` field (error, warn, info) indicates severity
- The `context` field shows which route and operation failed
- The `stack` (in development) points to the exact line of code
- The `timestamp` allows correlation with other system events

**Example Debugging Workflow:**
1. Monitoring alert: "High error rate on /api/projects"
2. Check logs filtered by `route: "/api/projects"`
3. See error code: `DATABASE_ERROR`
4. In development, check `stack` field to see exact Prisma error
5. Fix the query and redeploy

#### Security Advantages

**Prevents Information Leakage:**
- Production responses never include stack traces, database schemas, or query details
- Stack traces only appear in internal logs, not visible to users
- Validation errors provide guidance without exposing data model

**Example:**
- User submits invalid data
- Production API returns: `{ success: false, message: "Validation failed", error: { code: "VALIDATION_ERROR" } }`
- Attacker learns nothing about the application structure
- Internal logs capture the specific validation failure for debugging

#### Extensibility: Custom Error Classes

This architecture supports future enhancements like custom error classes:

```typescript
// Could be added in future sprints
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// In errorHandler.ts
function getErrorDetails(error: unknown): ErrorDetails {
  if (error instanceof AuthenticationError) {
    return {
      code: ERROR_CODES.AUTHENTICATION_ERROR,
      message: 'Authentication failed',
      status: 401,
    };
  }
  // ... rest of logic
}
```

#### Extensibility: Context Aggregation

The `LogContext` can be extended with domain-specific information:

```typescript
// Authorization errors
handleError(error, {
  route: '/api/admin/users',
  userId: 'user-123',
  requiredRole: 'admin',
  userRole: 'user',
});

// Database performance
handleError(error, {
  route: '/api/projects',
  queryDuration: 5000,  // ms
  queryType: 'findMany',
});

// Feature flags
handleError(error, {
  route: '/api/experimental-feature',
  featureFlag: 'BETA_FEATURE_X',
  cohort: 'test-group-5',
});
```

### Production Readiness Checklist

- ✅ All API routes use `handleError()` or specific handlers
- ✅ No raw `console.log()` calls (all use structured `logger`)
- ✅ Consistent response format with `success` field
- ✅ Environment detection (dev vs. prod) implemented
- ✅ Stack traces included in dev logs only
- ✅ Error codes standardized in `errorCodes.ts`
- ✅ Structured JSON logging for aggregation services
- ✅ All errors logged internally, never exposed to clients
- ✅ Type-safe error handling with TypeScript interfaces
- ✅ Ready for integration with monitoring (Datadog, Sentry, CloudWatch, etc.)

---

## Redis Caching Layer

This project includes a **Redis-based caching layer** for API responses to reduce repeated database reads and improve response time under load.

### Why caching is used
- **Reduces database load**: read-heavy endpoints (like listing users) can avoid repeated Prisma queries for identical requests.
- **Improves latency**: a cached response is served from memory (Redis) instead of hitting Postgres.
- **Better scalability**: the API can handle more traffic with less database contention.

### Redis setup explanation
- **Local**: run a Redis server on `localhost:6379`.
- **Docker Compose**: this repo’s `docker-compose.yml` includes a `redis` service (port `6379`).

### Cache-aside strategy explanation
We use the **cache-aside (lazy loading)** pattern:
1. **Read path (GET)**: the API checks Redis first.
   - If a value exists, it’s a **Cache Hit** and the API returns it immediately.
   - If not, it’s a **Cache Miss** and the API queries Postgres via Prisma, then stores the result in Redis.
2. **Write path (POST/PATCH)**: after a successful database mutation, the API deletes the relevant cache key so the next GET repopulates it.

### TTL policy
- **Key**: `users:list`
- **TTL**: **60 seconds**

### Cache invalidation strategy
- After a user is created or updated, the API deletes the **`users:list`** key (best-effort invalidation). This forces the next read to refresh from the database.

### Reflection: stale data and cache coherence risks
Caching introduces the risk of **stale reads**:
- If invalidation fails or is incomplete, clients may see outdated data until the TTL expires.
- If multiple list keys exist (e.g., pagination variants), invalidating only `users:list` can leave other cached pages stale until they expire.

In production, you’d typically use a stronger invalidation strategy (key versioning, tag sets, or event-driven invalidation) depending on correctness requirements.

### Expected latency improvement (cold vs cached request)
Typical expectations for a read-heavy list route:
- **Cold request (cache miss)**: Postgres + Prisma query + serialization (often tens of milliseconds, depending on dataset and connection state).
- **Cached request (cache hit)**: Redis GET + JSON parse (often a few milliseconds).

---

## 🎨 Loading States & Error Boundaries

This application implements sophisticated loading states and error handling using Next.js 13+ App Router's `loading.tsx` and `error.tsx` file conventions.

### Architecture Overview

### Loading Skeletons (`loading.tsx`)

The App Router automatically renders `loading.tsx` files while asynchronous data is being fetched. This creates an immediate visual response to user navigation, preventing the appearance of an unresponsive interface.

**Key Benefits:**
- **Immediate feedback**: Users see a skeleton UI instantly upon navigation
- **Perceived performance**: Appears faster even if actual load time hasn't changed
- **Reduces bounce rate**: Users are less likely to click away if they see loading progress
- **Professional appearance**: Skeleton loaders are industry-standard for modern apps

**Implemented Loading States:**

#### 1. **Dashboard Loading** (`src/app/dashboard/loading.tsx`)
- Displays skeleton cards matching the dashboard layout
- Shows skeleton stats (4 cards)
- Shows skeleton project cards in a grid
- Animated dots indicating loading progress

**When it appears:**
```
User clicks Dashboard → Middleware validates auth → Component mounts
↓
loading.tsx displays immediately (0ms)
↓
Dashboard data fetches (with 2s simulated delay)
↓
page.tsx renders with real data
```

#### 2. **Project Details Loading** (`src/app/projects/[id]/loading.tsx`)
- Displays skeleton project header with title and description
- Shows task list skeleton with multiple task item placeholders
- Animated loading indicator

**When it appears:**
```
User navigates to /projects/123 → [id] route captured
↓
loading.tsx displays immediately
↓
fetchProject(123) starts (with 2s simulated delay)
↓
page.tsx renders with project data
```

### Skeleton Components (`src/components/ui/Skeleton.tsx`)

A reusable skeleton component system using Tailwind CSS's `animate-pulse` utility:

```tsx
// Base skeleton component
<Skeleton className="h-6 w-48 mb-2" />  // Animated gray box

// Composed skeletons
<StatCardSkeleton />      // For dashboard stats
<ProjectCardSkeleton />   // For project cards
<TaskItemSkeleton />      // For individual tasks
```

**Implementation Details:**
- Uses `bg-neutral-200` for neutral, professional appearance
- `animate-pulse` creates a subtle breathing effect
- Rounded corners match actual UI components
- Flexible sizing with Tailwind classes

### Error Boundaries (`error.tsx`)

The App Router automatically catches errors in child segments and renders `error.tsx` with access to the error object and a `reset()` function.

**Implemented Error Boundaries:**

#### 1. **Dashboard Error** (`src/app/dashboard/error.tsx`)
- Displays friendly error message
- Shows error details in development mode only
- Provides "Try Again" button (calls `reset()` to re-render)
- Provides "Go Home" navigation link

**Error Recovery Flow:**
```
Error thrown in dashboard → error.tsx catches it
↓
Display: "Oops! Dashboard Error"
↓
User clicks "Try Again"
↓
reset() re-executes fetchDashboardData()
↓
Either succeeds (page.tsx renders) or fails again (error.tsx stays)
```

#### 2. **Project Details Error** (`src/app/projects/[id]/error.tsx`)
- Displays "Project Not Found" message
- Explains possible reasons (deleted, no permission)
- Provides "Try Again" button (re-fetch project)
- Provides "Return to Dashboard" navigation

**Security Consideration:**
Both error boundaries show different error messages based on the actual error:
- `404` errors: "Project not found"
- `403` errors: "Permission denied" 
- Network errors: "Connection failed"
- This gives users helpful context without exposing system details

### Testing Loading & Error States

#### **1. Visualizing Loading States with Network Throttling**

**Steps to test:**
1. Navigate to `http://localhost:3000/dashboard`
2. Open DevTools (F12)
3. Go to **Network** tab
4. Click the speed dropdown (usually shows "No throttling")
5. Select **Slow 3G** or **Custom** (enter 2000ms latency)
6. Refresh the page (Ctrl+R)

**What you'll see:**
- Loading skeleton displays immediately
- Skeleton animates with `animate-pulse` effect
- Animated dots bounce while loading
- After ~2 seconds, real dashboard data replaces skeleton

**Why this matters:**
- 4G networks are not universal; many users experience slow connections
- Mobile networks often experience packet loss and latency spikes
- Skeleton loaders prove your app remains responsive during load

#### **2. Testing Error Boundaries**

**Option A: Intentional Test Error**

Modify `src/app/dashboard/page.tsx` temporarily:

```tsx
useEffect(() => {
  // Test error boundary
  throw new Error("Test error for error boundary");
}, []);
```

Then:
1. Navigate to dashboard
2. Error boundary catches the error
3. See error message with "Try Again" button
4. Click "Try Again" to test `reset()` function
5. Remove the test error

**Option B: Network Error Simulation**

Use DevTools Network tab:
1. Open DevTools → Network tab
2. Check the box next to network name: **Offline**
3. Navigate to dashboard
4. All API calls fail
5. Component receives error state
6. Error boundary renders with message
7. Uncheck Offline, click "Try Again"
8. Data successfully loads

#### **3. Production-Ready Simulated Delay**

The 2-second delay in `fetchDashboardData()` and `fetchProject()` is intentional for demonstration. In production:

```tsx
// Development/Testing
const SIMULATE_DELAY = process.env.NODE_ENV === 'development' ? 2000 : 0;
await new Promise(r => setTimeout(r, SIMULATE_DELAY));

// OR remove entirely and rely on actual network latency
```

### User Experience Impact

#### **Reduced Perceived Wait Time**
- **Before**: White screen → After ~2 seconds → Content appears
- **After**: Skeleton screen (0ms) → Content progressively appears → After ~2 seconds → Final polish

The skeleton gives users immediate feedback, reducing "perceived" load time even though actual time is the same.

#### **Trust & Professional Appearance**
- Skeletons show the app is "working" on their request
- Demonstrates intentional design, not a broken UI
- Common in apps like LinkedIn, Twitter, YouTube
- Users trust applications that show loading states

#### **Error Resilience**
- Errors no longer break the entire page
- Users can recover with one click ("Try Again")
- Clear communication: "What went wrong" + "how to fix it"
- Prevents users from force-refreshing or navigating away

### Code Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx           # Main component (with 2s delay)
│   │   ├── loading.tsx        # Skeleton UI
│   │   ├── error.tsx          # Error boundary
│   │   └── DashboardActions.tsx
│   ├── projects/
│   │   └── [id]/
│   │       ├── page.tsx       # Main component (with 2s delay)
│   │       ├── loading.tsx    # Skeleton UI
│   │       └── error.tsx      # Error boundary
└── components/
    └── ui/
        └── Skeleton.tsx       # Reusable skeleton components
```

### How Next.js App Router Handles These Files

Next.js automatically matches file names in the file system to create enhanced routing behavior:

```
┌─────────────────────────────────────────┐
│  User navigates to /dashboard           │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  Route match found  │
        └──────────┬──────────┘
                   │
        ┌──────────▼────────────────────┐
        │ Render loading.tsx immediately │
        │ (skeleton UI shown to user)    │
        └──────────┬────────────────────┘
                   │
        ┌──────────▼──────────────────┐
        │  page.tsx data source runs  │
        │ (async fetch, 2s delay)     │
        └──────────┬──────────────────┘
                   │
        ┌──────────▼─────────────────────────┐
        │ Are there any errors?               │
        └──────────┬──────┬──────────────────┘
                   │      │
           ┌───────▼┐   ┌─▼──────────┐
           │ Yes    │   │ No         │
           └───┬────┘   └─┬──────────┘
               │         │
        ┌──────▼─┐    ┌──▼──────────┐
        │Render  │    │ Replace     │
        │error   │    │ loading.tsx │
        │.tsx    │    │ with        │
        └────────┘    │ page.tsx    │
                      └─────────────┘
```

### Browser DevTools Visualization

#### **Network Tab:**
- Shows API calls to `/api/projects` and `/api/auth/me`
- With throttling enabled, you can watch the timeline
- Skeleton displays while requests are pending

#### **React DevTools (if installed):**
- See `<Suspense>` boundaries (managed by Next.js)
- Watch component tree change from `loading.tsx` to `page.tsx`

### Best Practices Applied

1. ✅ **Skeleton shapes match content**: Stats skeleton matches stat card layout
2. ✅ **Neutral color palette**: Gray/neutral tones avoid harsh contrast
3. ✅ **Subtle animations**: `animate-pulse` is calm, not distracting
4. ✅ **Clear error messaging**: Users understand what failed and why
5. ✅ **Retry mechanism**: `reset()` function allows recovery without page reload
6. ✅ **Development vs production**: Error details only shown in dev mode
7. ✅ **Accessibility**: Semantic HTML, ARIA labels considered
8. ✅ **Responsive design**: Skeletons adapt to mobile/tablet/desktop

**Built with ❤️ for the NGO community**
**Built with ❤️ for the NGO community**
