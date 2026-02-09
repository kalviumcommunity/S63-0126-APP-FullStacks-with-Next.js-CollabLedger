"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
    status: string;
  }>;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
}

// Count-up animation hook for stats
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    if (end > 0) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, hasAnimated]);

  return count;
}

// Enhanced status badge with animation
function StatusBadge({ status }: { status: string }) {
  const styles = {
    IDEA: "bg-linear-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-200 shadow-sm",
    IN_PROGRESS:
      "bg-linear-to-r from-green-100 to-emerald-50 text-green-800 border-green-200 shadow-sm",
    COMPLETED:
      "bg-linear-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200 shadow-sm",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        styles[status as keyof typeof styles] || styles.IDEA
      } transition-all duration-300 hover:scale-110`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// Animated stat card component
function StatCard({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const animatedValue = useCountUp(value, 1200);

  return (
    <div
      className="stat-card bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <p className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
        {animatedValue}
      </p>
      <div className="mt-3 h-1 w-12 bg-linear-to-r from-emerald-400 to-green-400 rounded-full"></div>
    </div>
  );
}

// Organic section divider SVG
function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden ${flip ? "rotate-180" : ""}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-16"
        style={{ display: "block" }}
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className="fill-emerald-50 opacity-40"
        ></path>
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Three distinct sections - independent state
  const [myCreatedProjects, setMyCreatedProjects] = useState<Project[]>([]);
  const [contributedProjects, setContributedProjects] = useState<Project[]>([]);
  const [openProjects, setOpenProjects] = useState<Project[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const calculateStats = useCallback((projects: Project[]) => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (p) => p.status === "IN_PROGRESS"
    ).length;

    // Calculate task stats
    let completedTasks = 0;
    let pendingTasks = 0;

    projects.forEach((project) => {
      if (project.tasks) {
        project.tasks.forEach((task) => {
          if (task.status === "DONE") {
            completedTasks++;
          } else {
            pendingTasks++;
          }
        });
      }
    });

    setStats({
      totalProjects,
      activeProjects,
      completedTasks,
      pendingTasks,
    });
  }, []);

  const fetchMyCreatedProjects = useCallback(async () => {
    try {
      // Cookie is sent automatically
      const response = await fetch("/api/projects?mine=true&limit=100", {
        credentials: "include",
      });

      // Treat 403, 404, or any error as "no projects" - NOT a crash
      if (!response.ok) {
        console.warn(
          `[DASHBOARD][MY_CREATED_PROJECTS] API returned ${response.status} - treating as empty`
        );
        setMyCreatedProjects([]);
        calculateStats([]);
        return;
      }

      const data = await response.json();
      const projects = data.data?.projects || [];

      console.log(
        `[DASHBOARD][MY_CREATED_PROJECTS] Loaded ${projects.length} projects`
      );
      setMyCreatedProjects(projects);
      calculateStats(projects);
    } catch (err) {
      // Network or parsing error - treat as empty, NOT a crash
      console.error("[DASHBOARD][MY_CREATED_PROJECTS] Fetch failed:", err);
      setMyCreatedProjects([]);
      calculateStats([]);
    }
  }, [calculateStats]);

  const fetchContributedProjects = useCallback(async () => {
    try {
      // Note: This endpoint may need to be implemented on backend
      // For now, we'll handle gracefully if it doesn't exist
      // Cookie is sent automatically
      const response = await fetch("/api/projects?contributed=true&limit=100", {
        credentials: "include",
      });

      // Gracefully handle if endpoint not implemented yet
      if (!response.ok) {
        console.warn(
          `[DASHBOARD][CONTRIBUTED_PROJECTS] API returned ${response.status} - treating as empty (may not be implemented yet)`
        );
        setContributedProjects([]);
        return;
      }

      const data = await response.json();
      const projects = data.data?.projects || [];

      console.log(
        `[DASHBOARD][CONTRIBUTED_PROJECTS] Loaded ${projects.length} projects`
      );
      setContributedProjects(projects);
    } catch (err) {
      // Network or parsing error - treat as empty, NOT a crash
      console.error("[DASHBOARD][CONTRIBUTED_PROJECTS] Fetch failed:", err);
      setContributedProjects([]);
    }
  }, []);

  const fetchOpenProjects = useCallback(async () => {
    try {
      // Cookie is sent automatically
      const response = await fetch("/api/projects?public=true&limit=100", {
        credentials: "include",
      });

      // Treat errors as empty list - don't crash the dashboard
      if (!response.ok) {
        console.warn(
          `[DASHBOARD][OPEN_PROJECTS] API returned ${response.status} - treating as empty`
        );
        setOpenProjects([]);
        return;
      }

      const data = await response.json();
      const projects = data.data?.projects || [];

      console.log(
        `[DASHBOARD][OPEN_PROJECTS] Loaded ${projects.length} projects`
      );
      setOpenProjects(projects);
    } catch (err) {
      // Network or parsing error - treat as empty, NOT a crash
      console.error("[DASHBOARD][OPEN_PROJECTS] Fetch failed:", err);
      setOpenProjects([]);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    console.log("[DASHBOARD] Starting data fetch...");
    setLoading(true);

    // Fetch all three sections independently and in parallel
    await Promise.all([
      fetchMyCreatedProjects(),
      fetchContributedProjects(),
      fetchOpenProjects(),
    ]);

    setLoading(false);
    console.log("[DASHBOARD] Data fetch complete");
  }, [fetchMyCreatedProjects, fetchContributedProjects, fetchOpenProjects]);

  useEffect(() => {
    // Middleware already handles auth - just fetch data
    // No need to check localStorage or redirect
    console.log("[DASHBOARD] Component mounted, fetching data...");
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    // Call logout API to clear HTTP-only cookie
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Redirect to login (cookie is already cleared by backend)
    router.push("/login");
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent shadow-lg"></div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
          }
        }

        .stat-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .project-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .section-enter {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .wave-emoji {
          display: inline-block;
          animation: wave 2s ease-in-out infinite;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .glow-on-hover:hover {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-emerald-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                CollabLedger
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">User</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-16 section-enter">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 p-12 shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                  Welcome back, User
                  <span className="wave-emoji">👋</span>
                </h2>
                <p className="text-emerald-100 text-lg mb-2">
                  Here&apos;s what&apos;s happening in your projects
                </p>
                <p className="text-emerald-200 text-sm">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <StatCard
              label="Total Projects"
              value={stats.totalProjects}
              delay={0}
            />
            <StatCard
              label="Active Projects"
              value={stats.activeProjects}
              delay={100}
            />
            <StatCard
              label="Completed Tasks"
              value={stats.completedTasks}
              delay={200}
            />
            <StatCard
              label="Pending Tasks"
              value={stats.pendingTasks}
              delay={300}
            />
          </div>

          <WaveDivider />
          <WaveDivider />

          {/* My Created Projects */}
          <section className="mb-20 section-enter">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  My Created Projects
                </h3>
                <p className="text-gray-600">Projects you own and manage</p>
              </div>
              <div className="px-4 py-2 bg-emerald-100 rounded-full">
                <span className="text-sm font-bold text-emerald-700">
                  {myCreatedProjects.length} project
                  {myCreatedProjects.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {myCreatedProjects.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-emerald-200 hover:border-emerald-400 transition-all duration-300">
                <div className="float-animation mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-green-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-5xl">🌱</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Start Your First Project
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven&apos;t created any projects yet. Begin your journey
                  and make an impact!
                </p>
                <button className="px-8 py-4 text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2 font-semibold glow-on-hover">
                  <span className="text-2xl">➕</span>
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCreatedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="project-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:border-emerald-300 hover:-translate-y-2 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {project.title}
                        </h4>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="w-12 h-12 bg-linear-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-lg text-center"
                      >
                        View Project
                      </Link>
                      <button className="px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-300 hover:shadow-md">
                        Add Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <WaveDivider flip />

          {/* Projects I'm Contributing To */}
          <section className="mb-20 section-enter">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Projects I Contribute To
                </h3>
                <p className="text-gray-600">
                  Collaborations you&apos;re part of
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-100 rounded-full">
                <span className="text-sm font-bold text-blue-700">
                  {contributedProjects.length} project
                  {contributedProjects.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {contributedProjects.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all duration-300">
                <div className="float-animation mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-5xl">🤝</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Join a Project
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You&apos;re not contributing to any projects yet. Check out
                  the open projects below to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contributedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="project-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-blue-500 hover:border-blue-600 hover:-translate-y-2 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      By:{" "}
                      {project.owner?.name || project.owner?.email || "Unknown"}
                    </p>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="block w-full px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 hover:shadow-lg text-center"
                    >
                      View Project
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <WaveDivider />

          {/* Open Projects from Other NGOs */}
          <section className="mb-16 section-enter">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-500 via-emerald-500 to-green-500 p-10 shadow-2xl mb-8">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="text-5xl">🌍</span>
                    Discover Open Projects
                  </h3>
                  <p className="text-emerald-100 text-lg">
                    Join projects from NGOs and community members making a
                    difference
                  </p>
                </div>
                <div className="hidden lg:block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-xl font-bold text-white">
                    {openProjects.length} available
                  </span>
                </div>
              </div>
            </div>
            {openProjects.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                <div className="float-animation mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-5xl">🔍</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  No Open Projects Yet
                </h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no open projects available at the moment. Check back
                  later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {openProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="project-card bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border-2 border-emerald-200 hover:border-emerald-400 hover:-translate-y-3 group relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-400/10 to-green-400/10 rounded-bl-full"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {project.title}
                          </h4>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="w-14 h-14 bg-linear-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-3xl">🎯</span>
                        </div>
                      </div>
                      <div className="mb-4 p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">🏢</span>
                        </div>
                        <p className="text-sm text-emerald-800 font-semibold truncate">
                          {project.owner?.name ||
                            project.owner?.email ||
                            "Unknown NGO"}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      <Link
                        href={`/projects/${project.id}`}
                        className="block w-full px-6 py-4 text-base font-bold text-white bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-2xl transition-all duration-300 hover:shadow-xl text-center glow-on-hover"
                      >
                        🤲 Contribute Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className="text-center pb-16 section-enter">
            <div className="inline-block">
              <button className="px-12 py-5 text-xl font-bold text-white bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-2 inline-flex items-center gap-3 glow-on-hover">
                <span className="text-3xl">✨</span>
                <span>Create New Project</span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
