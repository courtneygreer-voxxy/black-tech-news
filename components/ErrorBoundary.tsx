'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * This prevents the entire app from crashing when a single component fails.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Track error with analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            {/* Pan-African flag bars */}
            <div className="mb-8 flex justify-center space-x-4">
              <div className="w-4 h-32 bg-red-600/30 rounded"></div>
              <div className="w-4 h-32 bg-black/30 rounded"></div>
              <div className="w-4 h-32 bg-green-600/30 rounded"></div>
            </div>

            <h1 className="text-4xl font-bold text-black mb-4">
              Something Went Wrong
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry—we've been notified
              and are looking into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-gray-100 p-4 rounded">
                <summary className="cursor-pointer font-bold text-red-600 mb-2">
                  Error Details (Dev Only)
                </summary>
                <pre className="text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-red-600 via-black to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
              >
                Reload Page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-4 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
