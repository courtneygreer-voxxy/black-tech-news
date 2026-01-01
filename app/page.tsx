'use client';

import { useState, useEffect } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNHero from '@/components/BTNHero';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import StructuredData from '@/components/StructuredData';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load cached data from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('btn_articles');
    const cachedTime = localStorage.getItem('btn_last_refresh');

    if (cached && cachedTime) {
      try {
        const parsedArticles = JSON.parse(cached);
        // Convert date strings back to Date objects
        const articlesWithDates = parsedArticles.map((article: any) => ({
          ...article,
          publishedAt: new Date(article.publishedAt),
        }));
        setArticles(articlesWithDates);
        setLastRefresh(new Date(cachedTime));
      } catch (error) {
        console.error('Error loading cached articles:', error);
      }
    }
  }, []);

  // Function to fetch and refresh articles
  const loadArticles = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchArticles(50); // Get up to 50 articles
      setArticles(data);

      // Update last refresh timestamp
      const now = new Date();
      setLastRefresh(now);

      // Cache articles and timestamp in localStorage
      localStorage.setItem('btn_articles', JSON.stringify(data));
      localStorage.setItem('btn_last_refresh', now.toISOString());
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch on mount (if no cache or cache is old)
  useEffect(() => {
    const cachedTime = localStorage.getItem('btn_last_refresh');
    const shouldFetch = !cachedTime ||
      (Date.now() - new Date(cachedTime).getTime() > 5 * 60 * 1000); // 5 minutes

    if (shouldFetch) {
      loadArticles();
    } else {
      setLoading(false);
    }
  }, []);

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO: Structured Data for GenAI Discovery */}
      {articles.length > 0 && <StructuredData articles={articles} />}

      <BTNNavbar
        onRefresh={() => loadArticles(true)}
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh}
      />
      <BTNHero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="space-y-4 text-center">
              <div className="flex justify-center space-x-2">
                <div className="w-4 h-16 bg-red-600 animate-pulse"></div>
                <div className="w-4 h-16 bg-black animate-pulse delay-75"></div>
                <div className="w-4 h-16 bg-green-600 animate-pulse delay-150"></div>
              </div>
              <p className="text-gray-600">Loading the latest news...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-32">
            <div className="flex justify-center space-x-2 mb-6">
              <div className="w-4 h-16 bg-gray-300"></div>
              <div className="w-4 h-16 bg-gray-300"></div>
              <div className="w-4 h-16 bg-gray-300"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Stories Yet
            </h3>
            <p className="text-gray-600">
              Check back soon for the latest Black tech news.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Article */}
            {featuredArticle && (
              <section>
                <ArticleCard article={featuredArticle} featured />
              </section>
            )}

            {/* Regular Articles Grid */}
            {regularArticles.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-black">
                    Latest Stories
                  </h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">
                    {regularArticles.length} {regularArticles.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>

                <div className="space-y-8">
                  {regularArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <BTNFooter />
    </div>
  );
}
