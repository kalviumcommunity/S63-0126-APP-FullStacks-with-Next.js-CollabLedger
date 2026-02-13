import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', label = 'Loading...', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`flex items-center justify-center ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-blue-600`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
