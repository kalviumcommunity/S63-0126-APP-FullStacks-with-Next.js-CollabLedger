# Global API Response Handler

## Overview

The Global API Response Handler ensures all API endpoints in the CollabLedger project return **consistent, predictable, and well-structured responses**. This standardization improves developer experience, simplifies client integration, and provides better observability and debugging capabilities.

---

## Response Envelope Format

### Success Response

All successful API responses follow this exact envelope:

```typescript
{
  "success": true,
  "message": "Human-readable success message",
  "data": <T>, // Actual response payload
  "timestamp": "2026-02-02T10:30:45.123Z" // ISO 8601 string
}
```

**HTTP Status Codes:**
- `200 OK` - Successful GET, PATCH, or general operations
- `201 Created` - Successful POST (resource creation)

### Error Response

All error responses follow this exact envelope:

```typescript
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE_IDENTIFIER", // Machine-readable error code
    "details": {} // Optional: only included for debugging
  },
  "timestamp": "2026-02-02T10:30:45.123Z" // ISO 8601 string
}
```

**HTTP Status Codes:**
- `400 Bad Request` - Validation errors, invalid input
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Unexpected server errors, database failures

---

## Implementation Files

### 1. `lib/errorCodes.ts`

Defines standardized, reusable error identifiers:

```typescript
export const ERROR_CODES = {
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PAGINATION: 'INVALID_PAGINATION',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // Not Found Errors
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Database Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_OPERATION_FAILED: 'DATABASE_OPERATION_FAILED',

  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
```

**Benefits:**
- **Machine-readable**: Clients can programmatically handle specific errors
- **Consistency**: Same error codes across all endpoints
- **Maintainability**: Centralized error definitions

### 2. `lib/responseHandler.ts`

Provides two main functions for sending standardized responses:

```typescript
/**
 * Send a success response
 * @param data - The response data payload
 * @param message - Human-readable success message (default: "Request successful")
 * @param status - HTTP status code (default: 200)
 */
export function sendSuccess<T>(
  data: T,
  message: string = 'Request successful',
  status: number = 200
): NextResponse<SuccessResponse<T>>

/**
 * Send an error response
 * @param message - Human-readable error message
 * @param code - Standard error code (from ERROR_CODES)
 * @param status - HTTP status code (default: 500)
 * @param details - Optional error details for debugging
 */
export function sendError(
  message: string,
  code: ErrorCode,
  status: number = 500,
  details?: unknown
): NextResponse<ErrorResponse>
```

**Benefits:**
- **Type-safe**: Full TypeScript support with generic data types
- **Timestamp automation**: ISO 8601 timestamps added automatically
- **No duplication**: Single source of truth for response formatting

---

## Usage Examples

### Success Response Example

**GET `/api/projects?page=1&limit=10`**

```typescript
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validation
    if (page < 1 || limit < 1 || limit > 100) {
      return sendError(
        'Invalid pagination parameters',
        ERROR_CODES.INVALID_PAGINATION,
        400
      );
    }

    const projects = await prisma.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    // Success response with custom message
    return sendSuccess(
      {
        projects,
        pagination: { page, limit, total: 42 },
      },
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

**Response:**

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "projects": [
      {
        "id": "proj-123",
        "title": "CollabLedger",
        "description": "NGO project tracking",
        "status": "IN_PROGRESS",
        "ownerId": "user-456",
        "createdAt": "2026-02-01T12:00:00.000Z",
        "updatedAt": "2026-02-02T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42
    }
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### Error Response Example

**POST `/api/tasks` with missing `projectId`**

```typescript
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, projectId } = body;

    // Validation
    if (!projectId || typeof projectId !== 'string') {
      return sendError(
        'ProjectId is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    // ... rest of logic
  } catch (error) {
    return sendError(
      'Failed to create task',
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}
```

**Response:**

```json
{
  "success": false,
  "message": "ProjectId is required and must be a string",
  "error": {
    "code": "INVALID_INPUT"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

### 404 Not Found Example

**GET `/api/projects/nonexistent-id`**

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
});

if (!project) {
  return sendError(
    'Project not found',
    ERROR_CODES.PROJECT_NOT_FOUND,
    404
  );
}
```

**Response:**

```json
{
  "success": false,
  "message": "Project not found",
  "error": {
    "code": "PROJECT_NOT_FOUND"
  },
  "timestamp": "2026-02-02T10:30:45.123Z"
}
```

---

## Applied to Existing Routes

The response handler has been integrated into:

✅ **`/api/projects`** (GET, POST)
- GET: Retrieve all projects with pagination
- POST: Create a new project
- Uses: `INVALID_PAGINATION`, `INVALID_INPUT`, `USER_NOT_FOUND`, `DATABASE_ERROR`

✅ **`/api/tasks`** (POST)
- POST: Create a new task
- Uses: `INVALID_INPUT`, `PROJECT_NOT_FOUND`, `DATABASE_ERROR`

These routes now:
- Use `sendSuccess()` and `sendError()` exclusively
- Eliminate duplicate response formatting
- Provide consistent error codes
- Follow the unified envelope format

---

## Developer Experience (DX) Benefits

### 1. **Predictable Client Integration**
Clients know exactly what structure to expect, making integration straightforward:

```javascript
// Client-side code is consistent across all endpoints
fetch('/api/projects')
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      console.log('Data:', response.data);
    } else {
      console.error('Error:', response.error.code);
    }
  });
```

### 2. **Less Boilerplate in Routes**
Before:

```typescript
// Every route repeated similar logic
return NextResponse.json(
  { success: true, data: projects },
  { status: 200 }
);
```

After:

```typescript
// Single line, automatic timestamp and format
return sendSuccess(projects, 'Projects retrieved successfully', 200);
```

### 3. **Type Safety**
TypeScript automatically validates success/error types:

```typescript
// IDE catches mistakes at compile time
sendSuccess(projects, 'msg', 200); // ✅ Correct
sendError('msg', 'INVALID_CODE', 400); // ✅ Type error if code is wrong
```

### 4. **Easy Error Handling**
Clients can reliably parse errors:

```javascript
if (response.error?.code === 'PROJECT_NOT_FOUND') {
  // Handle 404 specifically
} else if (response.error?.code === 'INVALID_INPUT') {
  // Handle 400 validation error
} else {
  // Handle generic 500 error
}
```

---

## Debugging and Observability Benefits

### 1. **Consistent Timestamps**
Every response includes an ISO 8601 timestamp for:
- Request-response correlation
- Performance monitoring
- Debugging time-based issues

### 2. **Machine-Readable Error Codes**
Monitoring systems can aggregate errors by code:

```
ERROR_CODES | COUNT | %
PROJECT_NOT_FOUND | 234 | 12%
INVALID_INPUT | 156 | 8%
DATABASE_ERROR | 43 | 2%
```

### 3. **Structured Logging**
Logs are consistent and easy to parse:

```typescript
console.error('Create task error:', error);
// Response structure makes log analysis easier
```

### 4. **Error Categorization**
HTTP status codes are semantic:
- `400` = Client errors (validation, bad input)
- `404` = Resource missing
- `500` = Server errors (database, unexpected)

This allows CDNs, firewalls, and monitoring tools to handle them appropriately.

### 5. **Security**
Internal error details (stack traces, SQL errors) are **never** exposed:

```typescript
// ❌ Bad: Leaks Prisma error details
catch (error) {
  return sendError('Database error', 'DATABASE_ERROR', 500, error);
}

// ✅ Good: Only internal logging, generic message to client
catch (error) {
  console.error('Detailed error:', error); // Logged internally
  return sendError('Failed to create task', 'DATABASE_ERROR', 500);
  // Client sees: generic message, no stack trace, no SQL
}
```

---

## Quality Checklist

✅ **Unified Response Envelope**
- Success: `{ success, message, data, timestamp }`
- Error: `{ success, message, error: { code, details? }, timestamp }`

✅ **Consistent HTTP Status Codes**
- 200/201 for success
- 400 for validation errors
- 404 for missing resources
- 500 for server errors

✅ **Error Code Standardization**
- All error codes in `ERROR_CODES`
- No magic strings
- Type-safe

✅ **No Mixed Formats**
- All responses go through `sendSuccess()` or `sendError()`
- No raw `NextResponse.json()` calls in updated routes
- Automatic timestamp generation

✅ **TypeScript Correctness**
- Full type definitions for request/response
- Generics for flexible data types
- Error code validation

✅ **Security**
- No internal errors exposed
- Details field optional and internal-only
- Status codes prevent information leakage

---

## Future Enhancements

1. **Middleware Integration**: Auto-wrap all route handlers
2. **Request Validation**: Zod/Joi schemas with automatic error responses
3. **Rate Limiting**: Return `429 Too Many Requests` with error code
4. **Authentication**: Return `401 Unauthorized` for missing/invalid tokens
5. **Authorization**: Return `403 Forbidden` for insufficient permissions
6. **Telemetry**: Track response times, error rates by endpoint

---

## Conclusion

The Global API Response Handler establishes a **single source of truth** for all API responses in CollabLedger. This ensures:

- **Consistency**: Every response follows the same format
- **Reliability**: Clients know what to expect
- **Maintainability**: Changes to format apply everywhere
- **Observability**: Structured logging and monitoring
- **Security**: No sensitive information leakage
- **Developer Experience**: Less boilerplate, better IDE support

By centralizing response formatting, CollabLedger achieves **production-grade API quality** while maintaining code simplicity.
