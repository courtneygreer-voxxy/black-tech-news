'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  status: 'checking' | 'healthy' | 'unhealthy';
  timestamp: string;
  checks: {
    site: 'ok' | 'error';
    api: 'ok' | 'error' | 'checking';
    articles: 'ok' | 'error' | 'checking';
  };
  metrics?: {
    responseTime: string;
    articlesAvailable: number;
  };
  error?: string;
}

/**
 * Health Check Page
 *
 * Client-side health monitoring page that checks:
 * 1. Site is responding (implicit - page loaded)
 * 2. Wolf Studio API is accessible
 * 3. Articles can be fetched
 *
 * Use this URL for uptime monitoring: https://blacktechnews.com/health
 */
export default function HealthCheckPage() {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    timestamp: new Date().toISOString(),
    checks: {
      site: 'ok',
      api: 'checking',
      articles: 'checking',
    },
  });

  useEffect(() => {
    const checkHealth = async () => {
      const startTime = Date.now();

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app';
        const response = await fetch(`${apiUrl}/api/articles/list?limit=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        });

        const responseTime = Date.now() - startTime;

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.articles || data.articles.length === 0) {
          throw new Error('API returned invalid data');
        }

        // All checks passed
        setHealth({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          checks: {
            site: 'ok',
            api: 'ok',
            articles: 'ok',
          },
          metrics: {
            responseTime: `${responseTime}ms`,
            articlesAvailable: data.articles.length,
          },
        });

      } catch (error) {
        const responseTime = Date.now() - startTime;

        // Health check failed
        setHealth({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          checks: {
            site: 'ok',
            api: 'error',
            articles: 'error',
          },
          metrics: {
            responseTime: `${responseTime}ms`,
            articlesAvailable: 0,
          },
        });
      }
    };

    checkHealth();
  }, []);

  // For uptime monitors that check for specific text
  const statusIndicator = health.status === 'healthy' ? '✅ HEALTHY' :
                          health.status === 'unhealthy' ? '❌ UNHEALTHY' :
                          '⏳ CHECKING';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Status Banner */}
        <div className={`mb-8 p-6 rounded-lg ${
          health.status === 'healthy' ? 'bg-green-50 border-2 border-green-500' :
          health.status === 'unhealthy' ? 'bg-red-50 border-2 border-red-500' :
          'bg-yellow-50 border-2 border-yellow-500'
        }`}>
          <h1 className="text-3xl font-bold mb-2">
            {statusIndicator}
          </h1>
          <p className="text-gray-600">
            Black Tech News Health Check
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last checked: {new Date(health.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Detailed Checks */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">System Checks</h2>

          <div className="space-y-4">
            {/* Site Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">Website</div>
                <div className="text-sm text-gray-600">Core site functionality</div>
              </div>
              <div className={`text-2xl ${health.checks.site === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
                {health.checks.site === 'ok' ? '✓' : '✗'}
              </div>
            </div>

            {/* API Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">Wolf Studio API</div>
                <div className="text-sm text-gray-600">Backend article service</div>
              </div>
              <div className={`text-2xl ${
                health.checks.api === 'ok' ? 'text-green-500' :
                health.checks.api === 'checking' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {health.checks.api === 'ok' ? '✓' :
                 health.checks.api === 'checking' ? '...' : '✗'}
              </div>
            </div>

            {/* Articles Check */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <div className="font-semibold">Articles</div>
                <div className="text-sm text-gray-600">Content availability</div>
              </div>
              <div className={`text-2xl ${
                health.checks.articles === 'ok' ? 'text-green-500' :
                health.checks.articles === 'checking' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {health.checks.articles === 'ok' ? '✓' :
                 health.checks.articles === 'checking' ? '...' : '✗'}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        {health.metrics && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Response Time</div>
                <div className="text-2xl font-bold">{health.metrics.responseTime}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Articles Available</div>
                <div className="text-2xl font-bold">{health.metrics.articlesAvailable}</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {health.error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Details</h2>
            <pre className="text-sm text-red-600 font-mono overflow-auto">
              {health.error}
            </pre>
          </div>
        )}

        {/* JSON Output for Programmatic Access */}
        <details className="bg-white rounded-lg shadow p-6 mt-6">
          <summary className="cursor-pointer font-bold text-gray-700 mb-2">
            Raw JSON Data (for monitoring tools)
          </summary>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(health, null, 2)}
          </pre>
        </details>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 via-black to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
