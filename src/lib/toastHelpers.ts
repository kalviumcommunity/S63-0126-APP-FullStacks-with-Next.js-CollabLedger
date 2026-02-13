import { toast } from 'sonner';

/**
 * Show a success toast notification
 */
export function showSuccessToast(message: string) {
  return toast.success(message, {
    duration: 4000,
    position: 'bottom-right',
  });
}

/**
 * Show an error toast notification
 */
export function showErrorToast(message: string) {
  return toast.error(message, {
    duration: 5000,
    position: 'bottom-right',
  });
}

/**
 * Show an info toast notification
 */
export function showInfoToast(message: string) {
  return toast.info(message, {
    duration: 4000,
    position: 'bottom-right',
  });
}

/**
 * Show a loading toast notification
 * Returns a toast ID that can be used to dismiss or update the toast
 */
export function showLoadingToast(message: string) {
  return toast.loading(message, {
    position: 'bottom-right',
  });
}

/**
 * Dismiss a toast by ID
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Parse error response and return user-friendly message
 */
export function parseErrorMessage(error: unknown): string {
  // Handle API error responses
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Default fallback message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Show error toast with parsed error message
 */
export function showErrorToastFromError(error: unknown) {
  const message = parseErrorMessage(error);
  return showErrorToast(message);
}

/**
 * Wrapper for async operations with loading/success/error toasts
 */
export async function withToast<T>(
  operation: () => Promise<T>,
  options: {
    loading: string;
    success: string;
    error?: string;
  }
): Promise<T> {
  const toastId = showLoadingToast(options.loading);
  
  try {
    const result = await operation();
    dismissToast(toastId);
    showSuccessToast(options.success);
    return result;
  } catch (error) {
    dismissToast(toastId);
    const errorMessage = options.error || parseErrorMessage(error);
    showErrorToast(errorMessage);
    throw error;
  }
}
