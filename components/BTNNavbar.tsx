'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

interface BTNNavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastRefresh?: Date | null | undefined;
}

export default function BTNNavbar({ onRefresh, isRefreshing, lastRefresh }: BTNNavbarProps) {
  const formatLastRefresh = (date: Date | null | undefined) => {
    if (!date) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <nav className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-12 bg-red-600"></div>
              <div className="w-2 h-12 bg-black"></div>
              <div className="w-2 h-12 bg-green-600"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Black Tech News
              </h1>
              <p className="text-xs text-gray-600 tracking-wide uppercase">
                The News You Need to Know
              </p>
            </div>
          </Link>

          {/* Refresh Section */}
          {onRefresh && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Last Updated
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {formatLastRefresh(lastRefresh)}
                </span>
              </div>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh articles"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline font-medium">
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
