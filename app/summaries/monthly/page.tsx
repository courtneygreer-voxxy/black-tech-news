'use client';

import { useState, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

// Generate list of monthly reports (only current month for now)
function generateMonthlyReports() {
  const reports = [];
  const today = new Date();

  // Only show the current month
  const reportDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const year = reportDate.getFullYear();
  const month = reportDate.getMonth() + 1;
  const reportId = `${year}-${String(month).padStart(2, '0')}`;

  reports.push({
    id: reportId,
    date: reportDate,
    // Estimated story count - you can fetch real counts later
    storyCount: Math.floor(Math.random() * 50) + 100,
  });

  return reports;
}

/**
 * Monthly Summary Landing Page
 *
 * Lists all available monthly reports with links to /monthly/[date]
 */
export default function MonthlySummaryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const reports = useMemo(() => generateMonthlyReports(), []);

  // Paginate reports
  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BTNNavbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <span>Monthly Summaries</span>
        </div>

        {/* Header - Google Style */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl text-gray-800 mb-1">
            Monthly Summaries
          </h1>
          <div className="text-sm text-gray-600">
            {reports.length} monthly report{reports.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Google-Style Results - List of Monthly Reports */}
        <div className="space-y-6 mb-12">
          {paginatedReports.map((report) => (
            <Link
              key={report.id}
              href={`/monthly/${report.id}`}
              className="group block border border-gray-200 rounded-lg p-6 hover:border-red-600 hover:shadow-md transition-all"
            >
              {/* Calendar Icon & Month */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl text-blue-700 group-hover:underline font-medium mb-1">
                    {formatMonth(report.date)} Report
                  </h2>

                  <div className="text-sm text-gray-600 mb-2">
                    {report.storyCount} articles analyzed • Published first Monday of each month
                  </div>

                  <div className="text-xs text-green-700">
                    blacktechnews.com/monthly/{report.id}
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
