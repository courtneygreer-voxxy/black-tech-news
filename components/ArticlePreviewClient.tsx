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

  // Load article data
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

        // If not in cache, fetch fresh data
        console.log('[ArticlePreview] Fetching fresh articles from API...');
        const articles = await fetchArticles(50);
        console.log('[ArticlePreview] Fetched', articles.length, 'articles from API');

        const found = articles.find(a => a.id === articleId);
        console.log('[ArticlePreview] Article found in API:', !!found);

        if (found) {
          setArticle(found);

          // Find related articles from same source
          const related = articles
            .filter(a =>
              a.source.name === found.source.name &&
              a.id !== articleId
            )
            .slice(0, 3);
          setRelatedArticles(related);
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
      <div className="min-h-screen bg-white">
        <BTNNavbar onRefresh={() => {}} isRefreshing={false} lastRefresh={null} />
        <div className="flex items-center justify-center py-32">
          <div className="space-y-4 text-center">
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-16 bg-red-600 animate-pulse"></div>
              <div className="w-4 h-16 bg-black animate-pulse delay-75"></div>
              <div className="w-4 h-16 bg-green-600 animate-pulse delay-150"></div>
            </div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
        <BTNFooter />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <BTNNavbar onRefresh={() => {}} isRefreshing={false} lastRefresh={null} />
        <div className="max-w-4xl mx-auto px-8 py-32 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBackClick}
            className="px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
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
