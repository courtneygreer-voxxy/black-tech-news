'use client';

import { useState, useEffect, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import Pagination from '@/components/Pagination';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';
import Link from 'next/link';
import { CalendarDays, Search } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

/**
 * Monthly Summary Page
 *
 * Simple paginated list of articles from the past 30 days
 * Goal: Give users a comprehensive monthly recap
 */
export default function MonthlySummaryPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthName, setMonthName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadMonthlyArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles(300);

        // Filter to last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const monthlyArticles = fetchedArticles.filter(
          article => new Date(article.publishedAt) >= thirtyDaysAgo
        );

        setArticles(monthlyArticles);
        setAllArticles(fetchedArticles);

        // Set month name
        const month = now.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });
        setMonthName(month);

      } catch (error) {
        console.error('Error loading monthly articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMonthlyArticles();
  }, []);

  // Filter articles by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;

    const query = searchQuery.toLowerCase();
    return articles.filter(
      article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.source.name.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  // Paginate articles
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get related articles (articles older than 30 days)
  const relatedArticles = useMemo(() => {
    const monthlyIds = new Set(articles.map(a => a.id));
    return allArticles.filter(a => !monthlyIds.has(a.id)).slice(0, 6);
  }, [articles, allArticles]);

  return (
    <div className="min-h-screen bg-white">
      <BTNNavbar />

      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {/* Header */}
        <div className="mb-12">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Monthly Summary</span>
          </div>

          {/* Title Section */}
          <div className="flex items-center space-x-3 mb-3">
            <CalendarDays className="w-8 h-8 text-red-600" />
            <h1 className="text-5xl font-bold text-black">
              Monthly Digest
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            {monthName} - Your Black Tech News Recap
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search this month's stories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-lg"
            />
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
        ) : (
          <>
            {/* Articles Grid */}
            <section className="mb-16">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <div className="flex justify-center space-x-2 mb-6">
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchQuery ? 'No Results Found' : 'No Articles Yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery ? 'Try adjusting your search terms.' : 'Check back soon for this month\'s stories.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {paginatedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={filteredArticles.length}
                    />
                  )}
                </>
              )}
            </section>

            {/* More Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="border-t-2 border-gray-200 pt-16">
                <h2 className="text-3xl font-bold text-black mb-8">
                  More Recent Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 via-black to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
                  >
                    View All Articles
                  </Link>
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
