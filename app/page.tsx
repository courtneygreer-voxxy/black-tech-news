'use client';

import { useState, useEffect, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import HeroArticle from '@/components/HeroArticle';
import SidebarFilters, { ActiveFilters, FilterOptions } from '@/components/SidebarFilters';
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
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    searchQuery: '',
    selectedSources: [],
    selectedTags: [],
  });

  // Analytics: Track scroll depth, time on page, and inbound UTM parameters
  useEffect(() => {
    const cleanupScroll = useScrollDepth();
    const cleanupTime = useTimeOnPage();

    // Track inbound UTM parameters (how users found the site)
    trackInboundUTM();

    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupTime) cleanupTime();
    };
  }, []);

  // Load cached data from localStorage on mount (synchronously for instant display)
  useEffect(() => {
    const cached = localStorage.getItem('btn_articles');
    const cachedTime = localStorage.getItem('btn_last_refresh');
    const lastPullDate = localStorage.getItem('btn_last_pull_date');
    const today = new Date().toDateString();

    // Check if cache is very stale (more than 6 hours old) or it's a new day
    const cacheAge = cachedTime ? Date.now() - new Date(cachedTime).getTime() : Infinity;
    const isStaleCache = cacheAge > 6 * 60 * 60 * 1000; // 6 hours
    const isNewDay = lastPullDate !== today;

    if (cached && cachedTime) {
      try {
        const parsedArticles = JSON.parse(cached);
        // Convert date strings back to Date objects
        const articlesWithDates = parsedArticles.map((article: any) => ({
          ...article,
          publishedAt: new Date(article.publishedAt),
        }));

        // If it's a new day and cache is stale, show the daily pull feature
        if (isNewDay && isStaleCache) {
          setShowDailyPull(true);
          setLoading(false);
        } else {
          // Show cached content immediately
          setArticles(articlesWithDates);
          setLastRefresh(new Date(cachedTime));
          setLoading(false);

          // Check if we need to fetch fresh data in background
          const shouldFetch = cacheAge > 5 * 60 * 1000; // 5 minutes

          if (shouldFetch) {
            // Fetch in background without showing loading state
            loadArticles(true);
          }
        }
      } catch (error) {
        console.error('Error loading cached articles:', error);
        setLoading(false);
      }
    } else {
      // No cache at all - show daily pull feature
      setShowDailyPull(true);
      setLoading(false);
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

  // Handle daily pull - fetch today's top stories
  const handleDailyPull = async () => {
    setIsPulling(true);

    // Track analytics for daily pull engagement
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'daily_stories_pull', {
        event_category: 'engagement',
        event_label: 'morning_ritual',
        value: 1,
      });
    }

    try {
      const data = await fetchArticles(50);

      // Only hide pull screen and show articles after data is loaded
      setArticles(data);
      setShowDailyPull(false);

      // Update timestamps
      const now = new Date();
      setLastRefresh(now);

      // Cache articles and mark today as pulled
      localStorage.setItem('btn_articles', JSON.stringify(data));
      localStorage.setItem('btn_last_refresh', now.toISOString());
      localStorage.setItem('btn_last_pull_date', now.toDateString());
    } catch (error) {
      console.error('Error pulling daily stories:', error);
      // On error, hide pull screen and show empty state
      setShowDailyPull(false);
    } finally {
      setIsPulling(false);
    }
  };

  // Extract dynamic filter options from loaded articles
  const filterOptions = useMemo<FilterOptions>(() => {
    const sources = new Set<string>();
    const tags = new Set<string>();

    articles.forEach((article) => {
      sources.add(article.source.name);
      article.tags.forEach((tag) => tags.add(tag));
    });

    return {
      sources: Array.from(sources).sort(),
      tags: Array.from(tags).sort(),
    };
  }, [articles]);

  // Filter articles based on active filters
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Search query filter
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content?.toLowerCase().includes(query) ||
          article.author?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (activeFilters.selectedSources.length > 0) {
      filtered = filtered.filter((article) =>
        activeFilters.selectedSources.includes(article.source.name)
      );
    }

    // Tag filter
    if (activeFilters.selectedTags.length > 0) {
      filtered = filtered.filter((article) =>
        article.tags.some((tag) => activeFilters.selectedTags.includes(tag))
      );
    }

    return filtered;
  }, [articles, activeFilters]);

  // Paginate filtered articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);

    // Track search queries
    if (newFilters.searchQuery && newFilters.searchQuery !== activeFilters.searchQuery) {
      trackSearch(newFilters.searchQuery, filteredArticles.length);
    }

    // Track source filter changes
    if (newFilters.selectedSources.length !== activeFilters.selectedSources.length) {
      const added = newFilters.selectedSources.filter(s => !activeFilters.selectedSources.includes(s));
      const removed = activeFilters.selectedSources.filter(s => !newFilters.selectedSources.includes(s));

      added.forEach(source => {
        trackFilterApplied({
          filterType: 'source',
          filterValue: source,
          resultCount: filteredArticles.length,
        });
      });
    }

    // Track tag filter changes
    if (newFilters.selectedTags.length !== activeFilters.selectedTags.length) {
      const added = newFilters.selectedTags.filter(t => !activeFilters.selectedTags.includes(t));

      added.forEach(tag => {
        trackFilterApplied({
          filterType: 'tag',
          filterValue: tag,
          resultCount: filteredArticles.length,
        });
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of articles section
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const heroArticle = filteredArticles[0];
  const regularArticles = currentPage === 1
    ? filteredArticles.slice(1, ITEMS_PER_PAGE)
    : paginatedArticles;

  return (
    <ErrorBoundary>
      {/* SEO: Structured Data for GenAI Discovery */}
      {articles.length > 0 && <StructuredData articles={articles} />}

      <BTNNavbar
        onRefresh={() => loadArticles(true)}
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh}
      />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-8 lg:px-16 py-12 w-full">
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
              <div className="bg-gray-100 rounded-lg h-12 animate-pulse"></div>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded h-8 animate-pulse"></div>
                <div className="bg-gray-100 rounded h-8 animate-pulse"></div>
                <div className="bg-gray-100 rounded h-8 animate-pulse"></div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-12">
              {/* Hero Skeleton */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-96 animate-pulse"></div>
                <div className="bg-gray-100 rounded h-8 w-3/4 animate-pulse"></div>
                <div className="bg-gray-100 rounded h-6 w-1/2 animate-pulse"></div>
              </div>

              {/* Article Grid Skeleton */}
              <div className="grid gap-8 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="bg-gray-200 rounded-lg aspect-[16/10] animate-pulse"></div>
                    <div className="bg-gray-100 rounded h-6 w-full animate-pulse"></div>
                    <div className="bg-gray-100 rounded h-4 w-3/4 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : showDailyPull ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="max-w-2xl w-full text-center">
              {/* Pan-African Flag Animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Animated colored bars */}
                  <div className={`absolute inset-0 flex space-x-4 ${isPulling ? 'animate-pulse' : ''}`}>
                    <div className={`flex-1 bg-red-600 rounded-lg transition-all duration-1000 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                    <div className={`flex-1 bg-black rounded-lg transition-all duration-1000 delay-100 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                    <div className={`flex-1 bg-green-600 rounded-lg transition-all duration-1000 delay-200 ${isPulling ? 'scale-110' : 'scale-100'}`}></div>
                  </div>

                  {/* Center icon */}
                  {!isPulling && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-8 shadow-2xl">
                        <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <h2 className="text-4xl font-bold text-black mb-4">
                {isPulling ? 'Pulling Today\'s Stories...' : 'Good Morning! ☀️'}
              </h2>

              {!isPulling ? (
                <>
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    Start your day with the latest Black tech news.<br />
                    Click below to generate today's top stories.
                  </p>

                  <button
                    onClick={handleDailyPull}
                    className="group relative px-12 py-6 bg-gradient-to-r from-red-600 via-black to-green-600 text-white text-xl font-bold rounded-lg hover:scale-105 transition-all duration-300 shadow-2xl overflow-hidden"
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>

                    <span className="relative flex items-center justify-center space-x-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Pull Today's Top Stories</span>
                    </span>
                  </button>

                  <p className="text-sm text-gray-500 mt-6">
                    Join thousands of students, founders, and professionals starting their day informed.
                  </p>
                </>
              ) : (
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <SidebarFilters
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              resultCount={filteredArticles.length}
              totalCount={articles.length}
            />

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="flex justify-center space-x-2 mb-6">
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                    <div className="w-4 h-16 bg-gray-300"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Articles Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Hero Article (only on page 1) */}
                  {currentPage === 1 && heroArticle && (
                    <section>
                      <HeroArticle article={heroArticle} />
                    </section>
                  )}

                  {/* Regular Articles */}
                  {regularArticles.length > 0 && (
                    <section className="space-y-8">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-black">
                          {currentPage === 1 ? 'More Stories' : `Page ${currentPage}`}
                        </h2>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-2">
                        {regularArticles.map((article, index) => {
                          // Calculate global position (accounting for hero article and pagination)
                          const globalPosition = currentPage === 1
                            ? index + 2 // +2 because hero is position 1
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

                      {/* Pagination */}
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
          </div>
        )}
      </main>

      <BTNFooter />

      {/* Floating Refresh Button */}
      <button
        onClick={() => loadArticles(true)}
        disabled={isRefreshing}
        className="fixed bottom-8 right-8 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 z-50 group"
        aria-label="Refresh articles"
      >
        <svg
          className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Refresh articles
        </span>
      </button>
    </ErrorBoundary>
  );
}
