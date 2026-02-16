import {
  Skeleton,
  ProjectHeaderSkeleton,
  TaskItemSkeleton,
} from "@/components/ui/Skeleton";

/**
 * Loading skeleton for the project details page.
 * Displays while project and task data is being fetched from the API.
 */
export default function ProjectDetailsLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Project Header Skeleton */}
        <div className="mb-8">
          <ProjectHeaderSkeleton />
        </div>

        {/* Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tasks */}
          <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="mb-6">
              <Skeleton className="h-7 w-48" />
            </div>

            {/* Task List */}
            <div className="space-y-4">
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
            </div>
          </div>

          {/* Sidebar - Project Info */}
          <div className="space-y-4">
            {/* Owner Info Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Stats Card */}
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <Skeleton className="h-4 w-20 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading message with animation */}
        <div className="mt-12 flex justify-center items-center space-x-2">
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <span className="ml-4 text-neutral-600">
            Loading project details...
          </span>
        </div>
      </div>
    </div>
  );
}
