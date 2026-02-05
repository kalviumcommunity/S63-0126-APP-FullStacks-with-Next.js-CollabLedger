// Incremental Static Regeneration (ISR)
// This page is statically generated but revalidated periodically
export const revalidate = 60; // Revalidate every 60 seconds

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    // Fetch from local API endpoint
    // The page will use cached data until revalidation occurs
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/projects`, {
      next: { revalidate: 60 }, // Optional: explicitly set cache time
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    // Return mock data when API is unavailable
    return [
      { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics' },
      { id: 2, name: 'Wireless Mouse', price: 49.99, category: 'Accessories' },
      { id: 3, name: 'USB-C Hub', price: 79.99, category: 'Accessories' },
      { id: 4, name: '4K Monitor', price: 399.99, category: 'Electronics' },
      { id: 5, name: 'Mechanical Keyboard', price: 129.99, category: 'Accessories' },
    ];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  const generatedAt = new Date().toISOString();

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-6">Products - Incremental Static Regeneration (ISR)</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Rendering Strategy: Hybrid</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This page uses <strong>Incremental Static Regeneration (ISR)</strong> with <code className="bg-gray-100 px-2 py-1 rounded text-red-600">export const revalidate = 60</code>.
            The page is pre-rendered at build time and served as static HTML, but revalidated every 60 seconds 
            to keep data fresh without regenerating on every request.
          </p>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-purple-900 font-semibold mb-2">Key Characteristics:</p>
            <ul className="text-purple-800 space-y-2">
              <li>✓ Initially generated at build time</li>
              <li>✓ Revalidated periodically (every 60 seconds)</li>
              <li>✓ Static HTML served between revalidations</li>
              <li>✓ Background regeneration on-demand</li>
              <li>✓ Balance between performance and freshness</li>
              <li>✓ Reduced server load compared to SSR</li>
              <li>✓ Faster than SSR, fresher than pure SSG</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
            <p className="text-purple-900 font-semibold mb-2">Cache Status:</p>
            <p className="text-purple-800 mb-2">
              ⏱️ This page revalidates every <strong>60 seconds</strong>
            </p>
            <p className="text-gray-600 text-sm">
              Generated at: {generatedAt}
            </p>
            <p className="text-gray-600 text-sm">
              Refresh after 60 seconds to see potentially updated product data
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6">Product Catalog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                <p className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Use Cases for ISR</h2>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>Product catalogs that update occasionally</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>Blog posts with comments (revalidate periodically)</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>Inventory pages with infrequent changes</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>News articles or feeds</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold mr-3">•</span>
              <span>E-commerce listings (update every few minutes)</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Why ISR is Powerful</h2>
          <p className="text-gray-700 mb-4">
            ISR combines the best of both worlds:
          </p>
          <ul className="text-gray-700 space-y-2">
            <li>✨ <strong>Speed:</strong> Serves pre-rendered static HTML (fast as SSG)</li>
            <li>✨ <strong>Freshness:</strong> Regenerates in the background (fresh as SSR)</li>
            <li>✨ <strong>Scalability:</strong> Handles traffic spikes without strain</li>
            <li>✨ <strong>Cost-efficient:</strong> Fewer server computations than SSR</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-8 text-center">
          This page uses intelligent caching and revalidation for optimal performance and data freshness.
        </p>
      </div>
    </main>
  );
}
