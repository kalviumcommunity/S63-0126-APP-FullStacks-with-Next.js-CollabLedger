/**
 * Global API Response Handler
 * Ensures all API responses follow a unified, consistent envelope format
 */

import { NextResponse } from 'next/server';
import { ErrorCode } from './errorCodes';

/**
 * Success Response Envelope
 */
interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Error Response Envelope
 */
interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: ErrorCode;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Send a success response
 * @param data The response data payload
 * @param message Human-readable success message
 * @param status HTTP status code (default: 200)
 * @returns NextResponse with success envelope
 */
export function sendSuccess<T>(
  data: T,
  message: string = 'Request successful',
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Send an error response
 * @param message Human-readable error message
 * @param code Standard error code for machine consumption
 * @param status HTTP status code (default: 500)
 * @param details Optional error details (not exposed to public)
 * @returns NextResponse with error envelope
 */
export function sendError(
  message: string,
  code: ErrorCode,
  status: number = 500,
  details?: unknown
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    success: false,
    message,
    error: {
      code,
    },
    timestamp: new Date().toISOString(),
  };

  // Only include details if explicitly provided (for debugging/logging purposes)
  if (details !== undefined) {
    response.error.details = details;
  }

  return NextResponse.json(response, { status });
}
