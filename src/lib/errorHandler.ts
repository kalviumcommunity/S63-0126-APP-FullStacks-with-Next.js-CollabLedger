/**
 * Centralized Error Handler
 * Provides consistent error handling across all API routes
 * 
 * Features:
 * - Detects environment (development vs production)
 * - Returns detailed errors in development
 * - Returns safe, minimal errors in production
 * - Logs all errors internally using structured logger
 * - Consistent response format with NextResponse
 * 
 * Usage:
 * try {
 *   // route logic
 * } catch (error) {
 *   return handleError(error, { route: '/api/users', userId: 123 });
 * }
 */

import { NextResponse } from 'next/server';
import { logger, LogContext } from './logger';
import { ERROR_CODES, ErrorCode } from './errorCodes';

export interface ErrorContext extends LogContext {
  route: string;
  method?: string;
  userId?: string | number;
  [key: string]: unknown;
}

interface ErrorDetails {
  code: ErrorCode;
  message: string;
  status: number;
}

/**
 * Determine if an error is a Prisma error
 */
function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.constructor.name === 'PrismaClientKnownRequestError' ||
      error.constructor.name === 'PrismaClientValidationError' ||
      error.constructor.name === 'PrismaClientRustPanicError')
  );
}

/**
 * Determine if an error is a validation error
 */
function isValidationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  );
}

/**
 * Map error to standardized error details
 */
function getErrorDetails(error: unknown): ErrorDetails {
  if (!(error instanceof Error)) {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
      status: 500,
    };
  }

  // Validation errors
  if (isValidationError(error)) {
    return {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      status: 400,
    };
  }

  // Prisma database errors
  if (isPrismaError(error)) {
    return {
      code: ERROR_CODES.DATABASE_ERROR,
      message: 'Database operation failed',
      status: 500,
    };
  }

  // Default to internal server error
  return {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    status: 500,
  };
}

/**
 * Centralized error handler for API routes
 * 
 * @param error The error to handle
 * @param context Error context with route name and optional metadata
 * @returns NextResponse with appropriate error format
 */
export function handleError(
  error: unknown,
  context: ErrorContext
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorDetails = getErrorDetails(error);

  // Log the full error internally
  if (error instanceof Error) {
    logger.error(
      `API Error: ${errorDetails.message}`,
      context,
      error
    );
  } else {
    logger.error(`API Error: ${errorDetails.message}`, context);
  }

  // Build response based on environment
  const responseData = {
    success: false,
    message: errorDetails.message,
    error: {
      code: errorDetails.code,
      ...(isDevelopment && error instanceof Error
        ? { details: error.message }
        : {}),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(responseData, { status: errorDetails.status });
}

/**
 * Helper to handle validation errors with custom messages
 */
export function handleValidationError(
  message: string,
  context: ErrorContext
): NextResponse {
  logger.warn(`Validation error: ${message}`, context);

  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 400 }
  );
}

/**
 * Helper to handle not found errors
 */
export function handleNotFound(
  resourceType: string,
  context: ErrorContext
): NextResponse {
  const message = `${resourceType} not found`;
  logger.warn(message, context);

  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: ERROR_CODES.NOT_FOUND,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}
