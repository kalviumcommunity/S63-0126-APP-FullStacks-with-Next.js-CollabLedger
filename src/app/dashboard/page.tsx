// Dynamic Rendering (SSR)
// This page is rendered on every request with fresh data
// The dynamic export forces the page to render server-side for every user request
export const dynamic = 'force-dynamic';

async function fetchMetrics() {
  try {
    // In a real app, this would fetch from your actual API
    // The cache: 'no-store' ensures fresh data on every request
    const response = await fetch('https://api.example.com/metrics', {
      cache: 'no-store',
      // Note: This is a placeholder API. In production, use your real endpoint
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    return await response.json();
  } catch (error) {
    // Return mock data when API is unavailable
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-900 mb-6">Dashboard - Server-Side Rendering (SSR)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Rendering Strategy: Dynamic</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This page uses <strong>Server-Side Rendering (SSR)</strong> with <code className="bg-gray-100 px-2 py-1 rounded text-red-600">export const dynamic = 'force-dynamic'</code>.
            The page is rendered on the server for every single user request, ensuring the most up-to-date data.
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-900 font-semibold mb-2">Key Characteristics:</p>
            <ul className="text-green-800 space-y-2">
              <li>✓ Rendered on every request</li>
              <li>✓ Fresh data fetched with cache: 'no-store'</li>
              <li>✓ No caching between requests</li>
              <li>✓ Personalization based on user context</li>
              <li>✓ Slightly slower response time than SSG</li>
              <li>✓ Higher server load</li>
              <li>✓ Always shows current data</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">Live Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.activeUsers}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.requestCount}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Response Time</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.averageResponseTime}ms</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">Request Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Fetched at</p>
                <p className="text-lg font-semibold text-emerald-700">{fetchTime}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Server Time</p>
                <p className="text-lg font-semibold text-emerald-700">{metrics.serverTime}</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Refresh the page to see updated metrics with fresh server data.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Use Cases for SSR</h2>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">•</span>
              <span>Real-time dashboards and analytics</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">•</span>
              <span>Personalized user experiences</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">•</span>
              <span>User authentication-based content</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">•</span>
              <span>High-frequency data updates</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-3">•</span>
              <span>APIs requiring user context or headers</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-8 text-center">
          This page is rendered fresh on every request. Metrics update in real-time.
        </p>
      </div>
    </main>
  );
}
