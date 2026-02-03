# API Route Structure and Naming

## Overview
This document describes the RESTful API route structure for the CollabLedger application. All API endpoints are organized under the `/api/` directory using Next.js file-based routing.

## Route Structure

```
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts        (POST)    - User login
│   └── signup/
│       └── route.ts        (POST)    - User registration
├── health/
│   └── route.ts            (GET)     - Application health check
├── projects/
│   ├── route.ts            (GET, POST) - List/create projects
│   └── [id]/
│       ├── route.ts        (GET, PUT, DELETE) - Get/update/delete project
│       └── tasks/
│           └── route.ts    (GET) - Get all tasks in a project
├── tasks/
│   ├── route.ts            (GET, POST) - List/create tasks
│   └── [id]/
│       └── route.ts        (GET, PUT, DELETE) - Get/update/delete task
└── users/
    ├── route.ts            (GET, POST) - List/create users
    └── [id]/
        └── route.ts        (GET, PUT, DELETE) - Get/update/delete user
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
User login endpoint.
- **Request Body:** `{ email: string, password: string }`
- **Response:** User info with JWT token or error

#### POST `/api/auth/signup`
User registration endpoint.
- **Request Body:** `{ name: string, email: string, password: string }`
- **Response:** Newly created user or error

### Health Check Endpoint

#### GET `/api/health`
Application health and system status.
- **Response:** `{ status: 'ok', environment: string, database: { host, database } }`

### Projects Endpoints

#### GET `/api/projects`
Get all projects with pagination.
- **Query Parameters:**
  - `page` (default: 1) - Page number
  - `limit` (default: 10) - Items per page
- **Response:** `{ success: boolean, data: Project[], total: number }`

#### POST `/api/projects`
Create a new project.
- **Request Body:** `{ name: string, description?: string }`
- **Response:** Newly created project

#### GET `/api/projects/[id]`
Get a specific project by ID.
- **Path Parameters:** `id` - Project ID
- **Response:** Project details

#### PUT `/api/projects/[id]`
Update a specific project.
- **Path Parameters:** `id` - Project ID
- **Request Body:** `{ name?: string, description?: string }`
- **Response:** Updated project

#### DELETE `/api/projects/[id]`
Delete a specific project.
- **Path Parameters:** `id` - Project ID
- **Response:** Success message

#### GET `/api/projects/[id]/tasks`
Get all tasks within a specific project.
- **Path Parameters:** `id` - Project ID
- **Response:** Array of tasks

### Tasks Endpoints

#### GET `/api/tasks`
Get all tasks with pagination and filtering.
- **Query Parameters:**
  - `page` (default: 1) - Page number
  - `limit` (default: 10) - Items per page
  - `projectId` (optional) - Filter by project
- **Response:** `{ success: boolean, data: Task[], total: number }`

#### POST `/api/tasks`
Create a new task.
- **Request Body:** `{ title: string, description?: string, projectId: string }`
- **Response:** Newly created task

#### GET `/api/tasks/[id]`
Get a specific task by ID.
- **Path Parameters:** `id` - Task ID
- **Response:** Task details

#### PUT `/api/tasks/[id]`
Update a specific task.
- **Path Parameters:** `id` - Task ID
- **Request Body:** `{ title?: string, description?: string, status?: string }`
- **Response:** Updated task

#### DELETE `/api/tasks/[id]`
Delete a specific task.
- **Path Parameters:** `id` - Task ID
- **Response:** Success message

### Users Endpoints

#### GET `/api/users`
Get all users with pagination.
- **Query Parameters:**
  - `page` (default: 1) - Page number
  - `limit` (default: 10) - Items per page
- **Response:** `{ success: boolean, data: User[], total: number }`

#### POST `/api/users`
Create a new user (admin only).
- **Request Body:** `{ name: string, email: string, password: string }`
- **Response:** Newly created user

#### GET `/api/users/[id]`
Get a specific user by ID.
- **Path Parameters:** `id` - User ID
- **Response:** User details

#### PUT `/api/users/[id]`
Update a specific user.
- **Path Parameters:** `id` - User ID
- **Request Body:** `{ name?: string, email?: string }`
- **Response:** Updated user

#### DELETE `/api/users/[id]`
Delete a specific user.
- **Path Parameters:** `id` - User ID
- **Response:** Success message

## Design Principles

1. **RESTful Convention**: Endpoints follow REST conventions with appropriate HTTP methods (GET, POST, PUT, DELETE)
2. **Hierarchical Organization**: Related resources are grouped under their parent resource (e.g., `/projects/[id]/tasks`)
3. **Pagination**: List endpoints support pagination with `page` and `limit` query parameters
4. **Error Handling**: All endpoints return consistent error responses with status codes and messages
5. **Type Safety**: All routes use TypeScript with proper type definitions from Next.js Request/Response
6. **Database Integration**: Routes use Prisma ORM for database operations

## File Organization Benefits

- **Automatic Routing**: Next.js automatically maps files to routes
- **Predictable URLs**: Route structure matches file structure
- **Modularity**: Each resource has its own directory
- **Maintainability**: Easy to locate and update specific endpoints
- **Scalability**: Simple to add new resources or endpoints

## Status Verification

✅ Build: Successful
✅ All API routes compiled correctly
✅ Route structure follows RESTful conventions
✅ Type safety with TypeScript
✅ Pagination support implemented
✅ Error handling in place

## Next Steps

- Implement authentication middleware
- Add request validation schemas
- Document request/response examples
- Set up API documentation (Swagger/OpenAPI)
- Implement caching strategies
