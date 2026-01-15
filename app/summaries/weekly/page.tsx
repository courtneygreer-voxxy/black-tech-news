'use client';

import { useState, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

// Generate list of weekly digests
// Summaries are published on Mondays and cover the PREVIOUS week (Sunday-Saturday)
function generateWeeklyDigests() {
  const digests = [];

  // First week: January 5-11, 2026 (published Monday Jan 12)
  // This is the only week for now, more will be added each Monday
  const week1Start = new Date('2026-01-05T00:00:00'); // Sunday
  const week1End = new Date('2026-01-11T23:59:59');   // Saturday
  const week1Monday = new Date('2026-01-12T00:00:00'); // Publication date (Monday)

  digests.push({
    id: '2026-01-12', // Monday date when published
    monday: week1Monday,
    sunday: week1Start,
    saturday: week1End,
    storyCount: 45, // Approximate - will be accurate once generated
  });

  return digests;
}

/**
 * Weekly Summary Landing Page
 *
 * Lists all available weekly digests with links to /weekly/[date]
 */
export default function WeeklySummaryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const digests = useMemo(() => generateWeeklyDigests(), []);

  // Paginate digests
  const totalPages = Math.ceil(digests.length / ITEMS_PER_PAGE);
  const paginatedDigests = digests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format date range
  const formatDateRange = (sunday: Date, saturday: Date) => {
    const sunStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const satStr = saturday.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${sunStr} - ${satStr}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BTNNavbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <span>Weekly Summaries</span>
        </div>

        {/* Header - Google Style */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl text-gray-800 mb-1">
            Weekly Summaries
          </h1>
          <div className="text-sm text-gray-600">
            {digests.length} weekly digest{digests.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Google-Style Results - List of Weekly Digests */}
        <div className="space-y-6 mb-12">
          {paginatedDigests.map((digest) => (
            <Link
              key={digest.id}
              href={`/weekly/${digest.id}`}
              className="group block border border-gray-200 rounded-lg p-6 hover:border-red-600 hover:shadow-md transition-all"
            >
              {/* Calendar Icon & Date Range */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl text-blue-700 group-hover:underline font-medium mb-1">
                    Week of {formatDateRange(digest.sunday, digest.saturday)}
                  </h2>

                  <div className="text-sm text-gray-600 mb-2">
                    {digest.storyCount} stories • Published every Monday
                  </div>

                  <div className="text-xs text-green-700">
                    blacktechnews.com/weekly/{digest.id}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination - Google Style */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-16">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-2 text-blue-700 hover:bg-gray-100 rounded"
              >
                ‹ Previous
              </button>
            )}

            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded ${
                  currentPage === page
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 text-blue-700 hover:bg-gray-100 rounded"
              >
                Next ›
              </button>
            )}
          </div>
        )}
      </main>

      <BTNFooter />
    </div>
  );
}
