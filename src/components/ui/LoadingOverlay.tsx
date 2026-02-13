import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ message = 'Loading...', fullScreen = false }: LoadingOverlayProps) {
  return (
    <div
      className={`${
        fullScreen ? 'fixed' : 'absolute'
      } inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}
