'use client';

import { useState, useEffect, useMemo } from 'react';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticleCard from '@/components/ArticleCard';
import HeroArticle from '@/components/HeroArticle';
import SidebarFilters, { ActiveFilters, FilterOptions } from '@/components/SidebarFilters';
import Pagination from '@/components/Pagination';
import StructuredData from '@/components/StructuredData';
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
    <div className="min-h-screen bg-white">
      {/* SEO: Structured Data for GenAI Discovery */}
      {articles.length > 0 && <StructuredData articles={articles} />}

      <BTNNavbar
        onRefresh={() => loadArticles(true)}
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
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
    </div>
  );
}
