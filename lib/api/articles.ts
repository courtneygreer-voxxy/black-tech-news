import { NewsArticle } from '../news/types';
import { getApiUrl } from '../config';

export interface ArticlesResponse {
  success: boolean;
  articles: NewsArticle[];
  cached?: boolean;
  timestamp?: number;
  error?: string;
  message?: string;
}

export interface FeaturedArticleResponse {
  success: boolean;
  article: NewsArticle | null;
  timestamp?: number;
  error?: string;
  message?: string;
}

// Fetch all articles
export async function fetchArticles(
  limit: number = 50
): Promise<NewsArticle[]> {
  try {
    const params: Record<string, string> = { limit: limit.toString() };

    const url = getApiUrl('/api/articles/list', params);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable caching for static export
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data: ArticlesResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch articles');
    }

    // Convert date strings back to Date objects
    const articles = data.articles.map(article => ({
      ...article,
      publishedAt: new Date(article.publishedAt),
    }));

    // Black Tech News smart sorting: balance images with daily rotation
    articles.sort((a, b) => {
      // First, sort by recency
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Filter for fresh articles (within last 7 days) for first page
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentArticles = articles.filter(a => new Date(a.publishedAt) >= sevenDaysAgo);
    const olderArticles = articles.filter(a => new Date(a.publishedAt) < sevenDaysAgo);

    // Apply smart sorting: ensure first page (10 items) has mix of images and rotation
    const firstPageSize = 10;
    if (recentArticles.length >= firstPageSize) {
      // Use only recent articles for first page
      const withImages = recentArticles.filter(a => a.imageUrl);
      const withoutImages = recentArticles.filter(a => !a.imageUrl);

      // For first page: aim for 50% images, but ensure daily rotation
      // Use date as seed for consistent daily rotation
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);

      // Sort with images by date, then apply rotation offset based on day
      const rotationOffset = seed % Math.max(1, Math.min(withImages.length, firstPageSize));
      const rotatedWithImages = [
        ...withImages.slice(rotationOffset),
        ...withImages.slice(0, rotationOffset),
      ];

      // Take top 5 with images and top 5 without images for first page
      const targetImagesCount = Math.min(5, rotatedWithImages.length);
      const targetNoImagesCount = Math.min(5, withoutImages.length);

      const firstPageArticles = [
        ...rotatedWithImages.slice(0, targetImagesCount),
        ...withoutImages.slice(0, targetNoImagesCount),
      ].slice(0, firstPageSize);

      // Remaining recent articles + older articles stay in date order
      const remainingWithImages = rotatedWithImages.slice(targetImagesCount);
      const remainingWithoutImages = withoutImages.slice(targetNoImagesCount);

      const remainingRecentArticles = [...remainingWithImages, ...remainingWithoutImages]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return [...firstPageArticles, ...remainingRecentArticles, ...olderArticles];
    } else if (recentArticles.length > 0) {
      // Not enough recent articles for full first page, use what we have + older ones
      return [...recentArticles, ...olderArticles];
    }

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch featured article
export async function fetchFeaturedArticle(): Promise<NewsArticle | null> {
  try {
    const url = getApiUrl('/api/articles/featured');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured article: ${response.statusText}`);
    }

    const data: FeaturedArticleResponse = await response.json();

    if (!data.success || !data.article) {
      return null;
    }

    // Convert date string back to Date object
    return {
      ...data.article,
      publishedAt: new Date(data.article.publishedAt),
    };
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return null;
  }
}

// Track article view
export async function trackArticleView(
  articleUrl: string,
  articleTitle: string,
  source: string
): Promise<void> {
  try {
    const url = getApiUrl('/api/articles/view');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleUrl,
        articleTitle,
        source,
      }),
    });

    if (!response.ok) {
      console.error('Failed to track article view:', response.statusText);
    }
  } catch (error) {
    console.error('Error tracking article view:', error);
  }
}
