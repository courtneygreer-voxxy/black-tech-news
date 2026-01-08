'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsArticle } from '@/lib/news/types';
import { fetchArticles, trackArticleView } from '@/lib/api/articles';
import {
  trackPreviewPageView,
  trackPreviewPageExit,
  trackExternalClick,
  appendUTMParams
} from '@/lib/analytics';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import ArticlePreview from '@/components/ArticlePreview';

interface ArticlePreviewClientProps {
  articleId: string;
}

export default function ArticlePreviewClient({ articleId }: ArticlePreviewClientProps) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageViewStartTime] = useState(Date.now());

  // Load article data with fallback for new articles not in build
  useEffect(() => {
    const loadArticle = async () => {
      try {
        console.log('[ArticlePreview] ===== LOADING ARTICLE =====');
        console.log('[ArticlePreview] Received articleId:', articleId);
        console.log('[ArticlePreview] ArticleId type:', typeof articleId);
        console.log('[ArticlePreview] ArticleId length:', articleId.length);

        // Try to get from localStorage cache first
        const cached = localStorage.getItem('btn_articles');
        if (cached) {
          const articles = JSON.parse(cached);
          console.log('[ArticlePreview] Found', articles.length, 'cached articles');
          console.log('[ArticlePreview] Looking for article ID:', articleId);
          console.log('[ArticlePreview] First 5 article IDs from cache:');
          articles.slice(0, 5).forEach((a: any, idx: number) => {
            console.log(`  [${idx}] ID: "${a.id}"`);
            console.log(`  [${idx}] Match: ${a.id === articleId}`);
          });

          const found = articles.find((a: any) => a.id === articleId);
          console.log('[ArticlePreview] Article found in cache:', !!found);
          if (found) {
            console.log('[ArticlePreview] Found article title:', found.title);
          }

          if (found) {
            // Convert date string back to Date object
            const articleWithDate = {
              ...found,
              publishedAt: new Date(found.publishedAt),
            };
            setArticle(articleWithDate);

            // Find related articles from same source (3 max)
            const related = articles
              .filter((a: any) =>
                a.source.name === found.source.name &&
                a.id !== articleId
              )
              .slice(0, 3)
              .map((a: any) => ({
                ...a,
                publishedAt: new Date(a.publishedAt),
              }));
            setRelatedArticles(related);

            setLoading(false);
            return;
          }
        }

        // If not in cache, fetch fresh data from API
        // This handles new articles that weren't in the build
        console.log('[ArticlePreview] Article not in cache - fetching fresh from API...');
        console.log('[ArticlePreview] This may be a new article not yet in build');

        const articles = await fetchArticles(50);
        console.log('[ArticlePreview] Fetched', articles.length, 'articles from API');

        const found = articles.find(a => a.id === articleId);
        console.log('[ArticlePreview] Article found in API:', !!found);

        if (found) {
          console.log('[ArticlePreview] Successfully loaded new article:', found.title);
          setArticle(found);

          // Update cache with new articles including this one
          localStorage.setItem('btn_articles', JSON.stringify(articles));
          localStorage.setItem('btn_last_refresh', new Date().toISOString());

          // Find related articles from same source
          const related = articles
            .filter(a =>
              a.source.name === found.source.name &&
              a.id !== articleId
            )
            .slice(0, 3);
          setRelatedArticles(related);
        } else {
          console.log('[ArticlePreview] Article not found in API either - may have been removed');
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  // Track preview page view
  useEffect(() => {
    if (article) {
      trackPreviewPageView({
        articleId: article.id,
        articleTitle: article.title,
        articleUrl: article.url,
        source: article.source.name,
        category: article.category,
        author: article.author || 'Unknown',
        hasImage: !!article.imageUrl,
      });
    }
  }, [article]);

  // Track time on page when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (article) {
        const timeOnPage = Math.round((Date.now() - pageViewStartTime) / 1000);
        trackPreviewPageExit({
          articleId: article.id,
          articleTitle: article.title,
          timeOnPage,
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [article, pageViewStartTime]);

  const handleBackClick = () => {
    // Get stored scroll position
    const scrollPosition = sessionStorage.getItem('btn_scroll_position');

    // Navigate back
    router.back();

    // Restore scroll position after navigation
    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition, 10));
      }, 100);
    }
  };

  const handleExternalClick = () => {
    if (article) {
      const timeOnPage = Math.round((Date.now() - pageViewStartTime) / 1000);

      // Generate UTM-tagged URL for tracking
      const taggedUrl = appendUTMParams(article.url, {
        campaign: 'article_preview',
        content: article.category,
      });

      // Track the external click with time on page
      trackExternalClick({
        articleTitle: article.title,
        articleUrl: article.url,
        source: article.source.name,
        destination: taggedUrl,
        timeOnPreviewPage: timeOnPage,
      });

      // Also track via Wolf Studio API (use original URL)
      trackArticleView(article.url, article.title, article.source.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <BTNNavbar onRefresh={() => {}} isRefreshing={false} lastRefresh={null} />
        <div className="flex-grow flex items-center justify-center py-32">
          <div className="space-y-6 text-center max-w-lg">
            {/* Animated loading bars */}
            <div className="flex justify-center space-x-3">
              <div className="w-6 h-20 bg-red-600 animate-pulse rounded"></div>
              <div className="w-6 h-20 bg-black animate-pulse delay-75 rounded"></div>
              <div className="w-6 h-20 bg-green-600 animate-pulse delay-150 rounded"></div>
            </div>

            <h3 className="text-2xl font-bold text-black">Loading Article</h3>
            <p className="text-gray-600 leading-relaxed">
              Fetching the latest content for you...
            </p>

            {/* Skeleton content preview */}
            <div className="mt-12 space-y-4">
              <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
        <BTNFooter />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <BTNNavbar onRefresh={() => {}} isRefreshing={false} lastRefresh={null} />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-8 py-32 text-center">
            {/* Pan-African flag bars */}
            <div className="mb-8 flex justify-center space-x-4">
              <div className="w-4 h-32 bg-red-600/30 rounded"></div>
              <div className="w-4 h-32 bg-black/30 rounded"></div>
              <div className="w-4 h-32 bg-green-600/30 rounded"></div>
            </div>

            <h1 className="text-4xl font-bold text-black mb-4">Article Not Found</h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              This article may have been removed or the link might be outdated.
            </p>
            <p className="text-gray-500 mb-8">
              Don't worry—there's plenty of great Black tech news waiting for you on the homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBackClick}
                className="px-8 py-4 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Go Back
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-4 bg-gradient-to-r from-red-600 via-black to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
        <BTNFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BTNNavbar onRefresh={() => {}} isRefreshing={false} lastRefresh={null} />

      <ArticlePreview
        article={article}
        relatedArticles={relatedArticles}
        onBackClick={handleBackClick}
        onExternalClick={handleExternalClick}
      />

      <BTNFooter />
    </div>
  );
}
