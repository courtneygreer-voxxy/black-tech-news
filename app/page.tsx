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

  // Load cached data from localStorage on mount, then fetch fresh articles
  useEffect(() => {
    const cached = localStorage.getItem('btn_articles');
    const cachedTime = localStorage.getItem('btn_last_refresh');

    if (cached && cachedTime) {
      try {
        const parsedArticles = JSON.parse(cached);
        const articlesWithDates = parsedArticles.map((article: any) => ({
          ...article,
          publishedAt: new Date(article.publishedAt),
        }));

        setArticles(articlesWithDates);
        setLastRefresh(new Date(cachedTime));
        setLoading(false);

        const cacheAge = Date.now() - new Date(cachedTime).getTime();
        if (cacheAge > 5 * 60 * 1000) {
          loadArticles(true);
        }
      } catch (error) {
        console.error('Error loading cached articles:', error);
        loadArticles();
      }
    } else {
      loadArticles();
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
