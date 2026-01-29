// Static Site Generation (SSG)
// This page is generated at build time and served as static HTML to all users
export const revalidate = false;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6">About - Static Site Generation (SSG)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Rendering Strategy: Static</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This page uses <strong>Static Site Generation (SSG)</strong>. It is built once at build time and 
            the same static HTML is served to every user without any additional computation.
          </p>
          
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="text-indigo-900 font-semibold mb-2">Key Characteristics:</p>
            <ul className="text-indigo-800 space-y-2">
              <li>✓ Built at build time (during deployment)</li>
              <li>✓ No database queries or API calls per request</li>
              <li>✓ Instant response time for all users</li>
              <li>✓ Best for content that changes infrequently</li>
              <li>✓ Excellent for SEO (static HTML)</li>
              <li>✓ Minimal server load</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Use Cases for SSG</h2>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">•</span>
              <span>Blog posts and documentation pages</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">•</span>
              <span>Marketing landing pages</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">•</span>
              <span>Product catalogs with stable inventory</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-3">•</span>
              <span>FAQ pages and help documentation</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-8 text-center">
          This page content is determined at build time and does not change per request.
        </p>
      </div>
    </main>
  );
}
