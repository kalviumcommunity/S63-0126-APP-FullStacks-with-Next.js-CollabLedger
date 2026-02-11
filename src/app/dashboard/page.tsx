/**
 * Dashboard Page - SSR with reusable components
 * Demonstrates LayoutWrapper, Button, and Card usage.
 */
import { Card } from "@/components";
import DashboardActions from "./DashboardActions";

export const dynamic = "force-dynamic";

async function fetchMetrics() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
    const response = await fetch(`${baseUrl}/health`, {
      cache: "no-store",
      method: "GET",
    });

    if (!response.ok) throw new Error("Failed to fetch metrics");
    return response.json();
  } catch {
    return {
      activeUsers: Math.floor(Math.random() * 10000),
      serverTime: new Date().toISOString(),
      requestCount: Math.floor(Math.random() * 50000),
      averageResponseTime: (Math.random() * 150 + 50).toFixed(2),
    };
  }
}

export default async function DashboardPage() {
  const metrics = await fetchMetrics();
  const fetchTime = new Date().toLocaleTimeString();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-4xl font-bold text-black">
        Dashboard - Server-Side Rendering (SSR)
      </h1>

      <Card title="Rendering Strategy: Dynamic" className="mb-6">
        <p className="mb-4 leading-relaxed text-black/70">
          This page uses <strong>Server-Side Rendering (SSR)</strong> with{" "}
          <code className="rounded bg-neutral-100 px-2 py-1 text-sm">
            export const dynamic = &apos;force-dynamic&apos;
          </code>
          . The page is rendered on the server for every request.
        </p>
        <ul className="space-y-2 text-sm text-black/80">
          <li>✓ Rendered on every request</li>
          <li>✓ Fresh data with cache: &apos;no-store&apos;</li>
          <li>✓ No caching between requests</li>
          <li>✓ Personalization based on user context</li>
        </ul>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Live Metrics">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-black/60">Active Users</p>
              <p className="text-3xl font-bold text-black">
                {metrics.activeUsers}
              </p>
            </div>
            <div>
              <p className="text-sm text-black/60">Total Requests</p>
              <p className="text-3xl font-bold text-black">
                {metrics.requestCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-black/60">Avg Response Time</p>
              <p className="text-3xl font-bold text-black">
                {metrics.averageResponseTime}ms
              </p>
            </div>
          </div>
        </Card>

        <Card title="Request Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-black/60">Fetched at</p>
              <p className="font-semibold text-black">{fetchTime}</p>
            </div>
            <div>
              <p className="text-sm text-black/60">Server Time</p>
              <p className="font-semibold text-black">{metrics.serverTime}</p>
            </div>
            <p className="mt-4 text-sm text-black/50">
              Refresh the page to see updated metrics.
            </p>
          </div>
        </Card>
      </div>

      <Card title="Use Cases for SSR">
        <ul className="space-y-3 text-black/80">
          <li>• Real-time dashboards and analytics</li>
          <li>• Personalized user experiences</li>
          <li>• User authentication-based content</li>
          <li>• High-frequency data updates</li>
        </ul>
      </Card>

      <DashboardActions />

      <p className="mt-8 text-center text-sm text-black/50">
        This page uses LayoutWrapper, Button, and Card components.
      </p>
    </div>
  );
}
