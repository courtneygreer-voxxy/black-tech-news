'use client';

import { useState, useEffect, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';
import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

/**
 * Weekly Summary Page
 *
 * Google-style search results for weekly tech news
 * Shows every Friday with the week's stories
 */
export default function WeeklySummaryPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadWeeklyArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles(200);

        // Filter to last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyArticles = fetchedArticles.filter(
          article => new Date(article.publishedAt) >= sevenDaysAgo
        );

        setArticles(weeklyArticles);
        setAllArticles(fetchedArticles);

        // Set week range
        const startDate = sevenDaysAgo.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const endDate = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        setWeekRange({ start: startDate, end: endDate });

      } catch (error) {
        console.error('Error loading weekly articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyArticles();
  }, []);

  // Paginate articles
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get 4 more stories from outside this week
  const moreStories = useMemo(() => {
    const weeklyIds = new Set(articles.map(a => a.id));
    return allArticles.filter(a => !weeklyIds.has(a.id)).slice(0, 4);
  }, [articles, allArticles]);

  // Format relative time (like Google)
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white">
      <BTNNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <span>Weekly Summary</span>
        </div>

        {/* Header - Google Style */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl text-gray-800 mb-1">
            This Week in Black Tech
          </h1>
          <div className="text-sm text-gray-600">
            {weekRange.start} - {weekRange.end} · {articles.length} stories
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="space-x-3 flex">
              <div className="w-6 h-20 bg-red-600 animate-pulse rounded"></div>
              <div className="w-6 h-20 bg-black animate-pulse delay-75 rounded"></div>
              <div className="w-6 h-20 bg-green-600 animate-pulse delay-150 rounded"></div>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No stories this week yet. Check back Friday!</p>
          </div>
        ) : (
          <>
            {/* Google-Style Results */}
            <div className="space-y-8 mb-12">
              {paginatedArticles.map((article) => (
                <article key={article.id} className="group">
                  {/* Source & Time */}
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-gray-600">{article.source.name}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {getRelativeTime(new Date(article.publishedAt))}
                    </span>
                  </div>

                  {/* Title - Links to article detail page */}
                  <Link href={`/article/${article.id}`}>
                    <h2 className="text-xl text-blue-700 hover:underline cursor-pointer mb-1 leading-snug">
                      {article.title}
                    </h2>
                  </Link>

                  {/* URL Preview */}
                  <div className="text-xs text-green-700 mb-2">
                    {new URL(article.url).hostname}
                  </div>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
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

            {/* More Stories - 4 in a row */}
            {moreStories.length > 0 && (
              <section className="border-t border-gray-200 pt-8">
                <h2 className="text-lg text-gray-800 mb-6">More Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {moreStories.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.id}`}
                      className="group block"
                    >
                      <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <h3 className="text-sm text-blue-700 group-hover:underline line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">{article.source.name}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <BTNFooter />
    </div>
  );
}
