'use client';

import { useState, useEffect } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';
import Link from 'next/link';
import { CalendarDays, BarChart3, Sparkles } from 'lucide-react';

/**
 * Monthly Summary Page
 *
 * Shows the top stories from the past 30 days, organized by:
 * - Most impactful articles
 * - Monthly trends
 * - Top contributors
 * - Monthly highlights
 *
 * Goal: Give users a comprehensive monthly recap to stay informed
 */
export default function MonthlySummaryPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthName, setMonthName] = useState('');

  useEffect(() => {
    const loadMonthlyArticles = async () => {
      try {
        const allArticles = await fetchArticles(200);

        // Filter to last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const monthlyArticles = allArticles.filter(
          article => new Date(article.publishedAt) >= thirtyDaysAgo
        );

        setArticles(monthlyArticles);

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

  // Calculate top sources
  const topSources = articles.reduce((acc, article) => {
    const source = article.source.name;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSources = Object.entries(topSources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Calculate all tags with counts
  const monthlyTags = articles.reduce((acc, article) => {
    article.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(monthlyTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  // Group articles by week for activity chart
  const weeklyBreakdown = articles.reduce((acc, article) => {
    const articleDate = new Date(article.publishedAt);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - articleDate.getTime()) / (24 * 60 * 60 * 1000));
    const weekIndex = Math.floor(daysAgo / 7);

    if (weekIndex < 4) {
      const weekKey = `Week ${4 - weekIndex}`;
      acc[weekKey] = (acc[weekKey] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const maxCount = Math.max(...weeks.map(w => weeklyBreakdown[w] || 0), 1);

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
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <CalendarDays className="w-8 h-8 text-red-600" />
                <h1 className="text-5xl font-bold text-black">
                  Monthly Digest
                </h1>
              </div>
              <p className="text-xl text-gray-600">
                {monthName} - Your Black Tech News Recap
              </p>
            </div>
          </div>

          {/* Month Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-900 uppercase tracking-wide">
                  Total Stories
                </span>
                <Sparkles className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-red-900">{articles.length}</div>
              <p className="text-sm text-red-700 mt-1">Published this month</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-900 rounded-lg p-6 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Publications
                </span>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-white">{sortedSources.length}</div>
              <p className="text-sm text-gray-400 mt-1">Sources covered</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-900 uppercase tracking-wide">
                  Topics
                </span>
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-green-900">{sortedTags.length}</div>
              <p className="text-sm text-green-700 mt-1">Categories explored</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
                  Avg Per Week
                </span>
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-yellow-900">
                {Math.round(articles.length / 4)}
              </div>
              <p className="text-sm text-yellow-700 mt-1">Stories per week</p>
            </div>
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
            {/* Weekly Activity Chart */}
            <section className="mb-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-red-600" />
                Publishing Activity This Month
              </h2>
              <div className="flex items-end justify-between space-x-4 h-48">
                {weeks.map((week) => {
                  const count = weeklyBreakdown[week] || 0;
                  const heightPercent = (count / maxCount) * 100;
                  return (
                    <div key={week} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 w-full flex items-end justify-center">
                        <div
                          className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg transition-all hover:scale-105"
                          style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '20px' : '0' }}
                        >
                          {count > 0 && (
                            <div className="text-white font-bold text-center pt-2">
                              {count}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 text-sm font-semibold text-gray-700">
                        {week}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-6 text-center">
                Number of articles published per week
              </p>
            </section>

            {/* Top Categories */}
            {sortedTags.length > 0 && (
              <section className="mb-12 bg-green-50 rounded-lg p-8 border-2 border-green-200">
                <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Top Categories This Month
                </h2>
                <div className="flex flex-wrap gap-3">
                  {sortedTags.map(([tag, count]) => (
                    <div
                      key={tag}
                      className="px-5 py-3 bg-white border-2 border-green-600 rounded-full hover:bg-green-100 transition-colors shadow-sm"
                    >
                      <span className="font-bold text-black">{tag}</span>
                      <span className="ml-2 text-sm text-gray-600">({count})</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Contributors */}
            {sortedSources.length > 0 && (
              <section className="mb-12 bg-black rounded-lg p-8 border-2 border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                  Top Contributing Sources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedSources.map(([source, count], index) => (
                    <div
                      key={source}
                      className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="text-white font-semibold">{source}</div>
                      </div>
                      <div className="text-gray-400 text-sm">{count} articles</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles This Month */}
            <section>
              <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
                <CalendarDays className="w-7 h-7 mr-2 text-red-600" />
                All Stories From {monthName}
              </h2>

              {articles.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <div className="flex justify-center space-x-2 mb-6">
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Articles Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Check back soon for this month's stories.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 via-black to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
                  >
                    Back to Homepage
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <BTNFooter />
    </div>
  );
}
