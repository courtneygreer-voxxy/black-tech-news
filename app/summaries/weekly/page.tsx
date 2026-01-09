'use client';

import { useState, useEffect } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';
import Link from 'next/link';
import { Calendar, TrendingUp, Award } from 'lucide-react';

/**
 * Weekly Summary Page
 *
 * Shows the top stories from the past 7 days, organized by:
 * - Most viewed articles
 * - Top sources
 * - Trending topics
 * - Weekly insights
 *
 * Goal: Give users a reason to come back weekly for curated highlights
 */
export default function WeeklySummaryPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const loadWeeklyArticles = async () => {
      try {
        const allArticles = await fetchArticles(100);

        // Filter to last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyArticles = allArticles.filter(
          article => new Date(article.publishedAt) >= sevenDaysAgo
        );

        setArticles(weeklyArticles);

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

  // Calculate top sources
  const topSources = articles.reduce((acc, article) => {
    const source = article.source.name;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedSources = Object.entries(topSources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Calculate trending tags
  const trendingTags = articles.reduce((acc, article) => {
    article.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(trendingTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

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
            <span className="text-black font-medium">Weekly Summary</span>
          </div>

          {/* Title Section */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="w-8 h-8 text-red-600" />
                <h1 className="text-5xl font-bold text-black">
                  This Week in Black Tech
                </h1>
              </div>
              <p className="text-xl text-gray-600">
                {weekRange.start} - {weekRange.end}
              </p>
            </div>
          </div>

          {/* Week Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-900 uppercase tracking-wide">
                  Stories Published
                </span>
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-4xl font-bold text-red-900">{articles.length}</div>
              <p className="text-sm text-red-700 mt-1">Articles this week</p>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-900 rounded-lg p-6 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Active Sources
                </span>
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-white">{sortedSources.length}</div>
              <p className="text-sm text-gray-400 mt-1">Publications featured</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-900 uppercase tracking-wide">
                  Topics Covered
                </span>
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-green-900">{sortedTags.length}</div>
              <p className="text-sm text-green-700 mt-1">Trending topics</p>
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
            {/* Trending Topics Section */}
            {sortedTags.length > 0 && (
              <section className="mb-12 bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Trending Topics This Week
                </h2>
                <div className="flex flex-wrap gap-3">
                  {sortedTags.map(([tag, count]) => (
                    <div
                      key={tag}
                      className="px-4 py-2 bg-white border-2 border-green-600 rounded-full hover:bg-green-50 transition-colors"
                    >
                      <span className="font-semibold text-black">{tag}</span>
                      <span className="ml-2 text-sm text-gray-600">({count})</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Sources Section */}
            {sortedSources.length > 0 && (
              <section className="mb-12 bg-black rounded-lg p-8 border-2 border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-green-500" />
                  Top Sources This Week
                </h2>
                <div className="space-y-3">
                  {sortedSources.map(([source, count], index) => (
                    <div
                      key={source}
                      className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-green-500">
                          #{index + 1}
                        </div>
                        <div className="text-white font-semibold">{source}</div>
                      </div>
                      <div className="text-gray-400">{count} articles</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles This Week */}
            <section>
              <h2 className="text-3xl font-bold text-black mb-8 flex items-center">
                <TrendingUp className="w-7 h-7 mr-2 text-red-600" />
                All Stories This Week
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
                    Check back soon for this week's stories.
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
