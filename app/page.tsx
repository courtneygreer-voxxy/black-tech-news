'use client';

import { useState, useEffect, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import HeroArticle from '@/components/HeroArticle';
import TopFilters from '@/components/TopFilters';
import Pagination from '@/components/Pagination';
import StructuredData from '@/components/StructuredData';
import ErrorBoundary from '@/components/ErrorBoundary';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles } from '@/lib/api/articles';
import { useScrollDepth, useTimeOnPage, trackFilterApplied, trackSearch, trackInboundUTM } from '@/lib/analytics';

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDailyPull, setShowDailyPull] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<string | null>(null);

  // Analytics: Track scroll depth, time on page, and inbound UTM parameters
  useEffect(() => {
    const cleanupScroll = useScrollDepth();
    const cleanupTime = useTimeOnPage();

    // Track inbound UTM parameters
    trackInboundUTM();

    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupTime) cleanupTime();
    };
  }, []);

  // Load cached data from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('btn_articles');
    const cachedTime = localStorage.getItem('btn_last_refresh');
    const lastPullDate = localStorage.getItem('btn_last_pull_date');
    const today = new Date().toDateString();

    const cacheAge = cachedTime ? Date.now() - new Date(cachedTime).getTime() : Infinity;
    const isStaleCache = cacheAge > 6 * 60 * 60 * 1000; // 6 hours
    const isNewDay = lastPullDate !== today;

    if (cached && cachedTime) {
      try {
        const parsedArticles = JSON.parse(cached);
        const articlesWithDates = parsedArticles.map((article: any) => ({
          ...article,
          publishedAt: new Date(article.publishedAt),
        }));

        if (isNewDay && isStaleCache) {
          setShowDailyPull(true);
          setLoading(false);
        } else {
          setArticles(articlesWithDates);
          setLastRefresh(new Date(cachedTime));
          setLoading(false);

          const shouldFetch = cacheAge > 5 * 60 * 1000; // 5 minutes
          if (shouldFetch) {
            loadArticles(true);
          }
        }
      } catch (error) {
        console.error('Error loading cached articles:', error);
        setLoading(false);
      }
    } else {
      setShowDailyPull(true);
      setLoading(false);
    }
  }, []);

  const loadArticles = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await fetchArticles(50);
      setArticles(data);

      const now = new Date();
      setLastRefresh(now);

      localStorage.setItem('btn_articles', JSON.stringify(data));
      localStorage.setItem('btn_last_refresh', now.toISOString());
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDailyPull = async () => {
    setIsPulling(true);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'daily_stories_pull', {
        event_category: 'engagement',
        event_label: 'morning_ritual',
        value: 1,
      });
    }

    try {
      const data = await fetchArticles(50);
      setArticles(data);
      setShowDailyPull(false);

      const now = new Date();
      setLastRefresh(now);

      localStorage.setItem('btn_articles', JSON.stringify(data));
      localStorage.setItem('btn_last_refresh', now.toISOString());
      localStorage.setItem('btn_last_pull_date', now.toDateString());
    } catch (error) {
      console.error('Error pulling daily stories:', error);
      setShowDailyPull(false);
    } finally {
      setIsPulling(false);
    }
  };

  // Extract sources from articles
  const sources = useMemo(() => {
    const sourceSet = new Set<string>();
    articles.forEach((article) => sourceSet.add(article.source.name));
    return Array.from(sourceSet).sort();
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (activeSource) {
      filtered = filtered.filter((article) => article.source.name === activeSource);
    }

    return filtered;
  }, [articles, searchQuery, activeSource]);

  // Paginate
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSource]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      trackSearch(query, filteredArticles.length);
    }
  };

  const handleSourceChange = (source: string | null) => {
    setActiveSource(source);
    if (source) {
      trackFilterApplied({
        filterType: 'source',
        filterValue: source,
        resultCount: filteredArticles.length,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const heroArticle = filteredArticles[0];
  const regularArticles = currentPage === 1
    ? filteredArticles.slice(1, ITEMS_PER_PAGE)
    : paginatedArticles;

  return (
    <ErrorBoundary>
      {articles.length > 0 && <StructuredData articles={articles} />}

      <BTNNavbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 w-full">
        {loading ? (
          <div className="space-y-8">
            <div className="bg-gray-100 rounded-lg h-12 animate-pulse"></div>
            <div className="grid gap-8 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-gray-200 rounded-lg aspect-[16/10] animate-pulse"></div>
                  <div className="bg-gray-100 rounded h-6 w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : showDailyPull ? (
          <div className="flex items-center justify-center py-8 px-4">
            <div className="max-w-2xl w-full text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48">
                  <div className={`absolute inset-0 flex space-x-2 sm:space-x-3 ${isPulling ? 'animate-pulse' : ''}`}>
                    <div className={`flex-1 bg-red-600 rounded-lg transition-all duration-1000 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                    <div className={`flex-1 bg-black rounded-lg transition-all duration-1000 delay-100 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                    <div className={`flex-1 bg-green-600 rounded-lg transition-all duration-1000 delay-200 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                  </div>

                  {!isPulling && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 sm:p-6 shadow-2xl">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
                {isPulling ? 'Pulling Today\'s Stories...' : 'Good Morning! ☀️'}
              </h2>

              {!isPulling ? (
                <>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed px-4">
                    Start your day with the latest Black tech news.
                  </p>

                  <button
                    onClick={handleDailyPull}
                    className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-red-600 via-black to-green-600 text-white text-lg sm:text-xl font-bold rounded-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl overflow-hidden w-full max-w-md mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>
                    <span className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Pull Today's Top Stories</span>
                    </span>
                  </button>

                  <p className="text-xs sm:text-sm text-gray-500 mt-4 px-4">
                    Join thousands starting their day informed
                  </p>
                </>
              ) : (
                <div className="flex justify-center items-center space-x-2 py-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stories Yet</h3>
            <p className="text-gray-600">Check back soon for the latest Black tech news.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Filters */}
            <TopFilters
              sources={sources}
              activeSource={activeSource}
              searchQuery={searchQuery}
              onSourceChange={handleSourceChange}
              onSearchChange={handleSearchChange}
            />

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Hero Article */}
                {currentPage === 1 && heroArticle && (
                  <section>
                    <HeroArticle article={heroArticle} />
                  </section>
                )}

                {/* Regular Articles */}
                {regularArticles.length > 0 && (
                  <section className="space-y-8">
                    {currentPage === 1 && (
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-black">Latest News</h2>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                    )}

                    <div className="grid gap-8 md:grid-cols-2">
                      {regularArticles.map((article, index) => {
                        const globalPosition = currentPage === 1
                          ? index + 2
                          : (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                        return (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            position={globalPosition}
                          />
                        );
                      })}
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={filteredArticles.length}
                    />
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <BTNFooter />
    </ErrorBoundary>
  );
}
