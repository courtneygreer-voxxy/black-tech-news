'use client';

import Link from 'next/link';
import { Instagram, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BTNNavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastRefresh?: Date | null | undefined;
}

export default function BTNNavbar({ onRefresh, isRefreshing, lastRefresh }: BTNNavbarProps) {
  const [summariesOpen, setSummariesOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex space-x-1">
              <div className="w-1.5 h-8 sm:w-2 sm:h-12 bg-red-600"></div>
              <div className="w-1.5 h-8 sm:w-2 sm:h-12 bg-black"></div>
              <div className="w-1.5 h-8 sm:w-2 sm:h-12 bg-green-600"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-black">
                Black Tech News
              </h1>
              <p className="hidden md:block text-xs text-gray-600 tracking-wide uppercase">
                Celebrating Black Excellence in Technology, Startups, and Digital Culture
              </p>
            </div>
          </Link>

          {/* Navigation & Social Media */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Summaries Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSummariesOpen(!summariesOpen)}
                onBlur={() => setTimeout(() => setSummariesOpen(false), 200)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-red-600 transition-colors" />
                <span className="hidden sm:inline font-semibold text-gray-700 group-hover:text-black">
                  Summaries
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-700 transition-transform ${summariesOpen ? 'rotate-180' : ''}`} />
              </button>

              {summariesOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-xl rounded-lg overflow-hidden">
                  <Link
                    href="/summaries/weekly"
                    className="block px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-bold text-black">Weekly</div>
                        <div className="text-xs text-gray-600">Last 7 days</div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/summaries/monthly"
                    className="block px-4 py-3 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-black">Monthly</div>
                        <div className="text-xs text-gray-600">Last 30 days</div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 border-l border-gray-200 pl-2 sm:pl-4 lg:pl-6">
              <a
                href="https://www.instagram.com/blacktechnews.cc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://x.com/blacktechnewscc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.reddit.com/r/blacktechnews/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Join us on Reddit"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
