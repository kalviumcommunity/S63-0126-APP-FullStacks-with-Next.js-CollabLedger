/**
 * Skeleton loading component using Tailwind animate-pulse
 */

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-neutral-200 animate-pulse rounded ${className}`} />
  );
}

/**
 * Skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

/**
 * Skeleton for project cards
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for task items in a list
 */
export function TaskItemSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded p-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/3 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/**
 * Skeleton for detailed project section header
 */
export function ProjectHeaderSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
      <Skeleton className="h-8 w-64 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
    </div>
  );
}
