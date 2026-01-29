/**
 * Client-safe public environment variables
 * 
 * This file demonstrates safe client-side usage of environment variables.
 * Variables here:
 * - Must be prefixed with NEXT_PUBLIC_ to be accessible in the browser
 * - Are compiled into the bundle at build time
 * - Can be used in both server and client components
 * - Should NEVER contain sensitive data (secrets, API keys, etc.)
 * 
 * You can import this in:
 * - Client components
 * - Server components
 * - API routes
 */

/**
 * Get the public API base URL for making API requests
 * @returns The API base URL (e.g., http://localhost:3000/api)
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
}

/**
 * Get the public app environment (safe for client use)
 * @returns The environment label (development, staging, production)
 */
export function getPublicAppEnv(): string {
  return process.env.NEXT_PUBLIC_APP_ENV || 'development';
}

/**
 * Example: Make an API request using the public base URL
 * This can be used in both server and client components
 */
export async function fetchFromApi(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response;
}
