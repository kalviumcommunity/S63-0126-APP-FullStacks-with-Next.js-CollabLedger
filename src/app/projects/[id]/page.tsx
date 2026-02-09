"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Types based on Prisma schema
interface Project {
  id: string;
  title: string;
  description: string;
  status: "IDEA" | "IN_PROGRESS" | "COMPLETED";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string | null;
    email: string;
  };
  tasks?: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    createdAt: string;
  }>;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles = {
    IDEA: "bg-linear-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-200",
    IN_PROGRESS:
      "bg-linear-to-r from-green-100 to-emerald-50 text-green-800 border-green-200",
    COMPLETED:
      "bg-linear-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200",
    TODO: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DONE: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
        styles[status as keyof typeof styles] ||
        "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Middleware already handles auth - just fetch data
    fetchProject(projectId);
  }, [projectId, router]);

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      setError("");

      // Cookie is sent automatically
      const response = await fetch(`/api/projects/${id}`, {
        credentials: "include",
      });

      if (response.status === 404) {
        setError("Project not found");
        setProject(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }

      const data = await response.json();
      setProject(data.data);
    } catch (err) {
      console.error("[PROJECT DETAIL ERROR]", err);
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent shadow-lg"></div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-5xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {error === "Project not found" ? "Project Not Found" : "Error"}
          </h2>
          <p className="text-gray-600 mb-8">
            {error === "Project not found"
              ? "The project you're looking for doesn't exist or has been removed."
              : error || "Something went wrong while loading the project."}
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-xl font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // For now, we don't know the current user ID from cookies
  // Could be added via server-side props or API call if needed
  const isOwner = false; // Placeholder - backend should handle ownership checks

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              CollabLedger
            </h1>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-emerald-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge status={project.status} />
                  {isOwner && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                      You Own This
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="w-20 h-20 bg-linear-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-5xl">📊</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Project Owner</p>
                <p className="text-gray-900 font-semibold">
                  {project.owner?.name || project.owner?.email || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created On</p>
                <p className="text-gray-900 font-semibold">{createdDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
                <p className="text-gray-900 font-semibold">
                  {project.tasks?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
            {isOwner && (
              <button className="px-6 py-3 text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-lg font-semibold">
                + Add Task
              </button>
            )}
          </div>

          {!project.tasks || project.tasks.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-emerald-200">
              <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <span className="text-5xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Tasks Yet
              </h3>
              <p className="text-gray-600 mb-6">
                {isOwner
                  ? "Get started by adding your first task to this project."
                  : "This project doesn't have any tasks yet."}
              </p>
              {isOwner && (
                <button className="px-8 py-4 text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-xl font-semibold inline-flex items-center gap-2">
                  <span className="text-2xl">+</span>
                  Create First Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-emerald-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {task.title}
                    </h3>
                    <StatusBadge status={task.status} />
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
