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

// Fetch all articles (for build-time SSG with caching)
export async function fetchArticlesForBuild(
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
      // Cache during build for SSG
      cache: 'force-cache',
      next: {
        revalidate: 3600, // Revalidate every hour during build
      },
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

    // Apply same sorting logic as client-side
    return articles;
  } catch (error) {
    console.error('Error fetching articles for build:', error);
    return [];
  }
}

// Fetch all articles (for client-side runtime)
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
      // No caching for client-side (always fresh)
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

    // Black Tech News smart sorting: lock hero, rotate the rest
    articles.sort((a, b) => {
      // First, sort by recency
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Filter for fresh articles (within last 7 days) for first page
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentArticles = articles.filter(a => new Date(a.publishedAt) >= sevenDaysAgo);
    const olderArticles = articles.filter(a => new Date(a.publishedAt) < sevenDaysAgo);

    // Apply smart sorting: lock hero (position 0), rotate positions 1-9
    const firstPageSize = 10;
    if (recentArticles.length >= firstPageSize) {
      // Separate articles with and without images
      const withImages = recentArticles.filter(a => a.imageUrl);
      const withoutImages = recentArticles.filter(a => !a.imageUrl);

      if (withImages.length === 0) {
        // No images available, just return by date
        return articles;
      }

      // HERO (Position 0): Lock newest article with image for 24 hours
      const heroArticle = withImages[0]; // Always the newest article with an image
      const remainingWithImages = withImages.slice(1); // Rest of articles with images

      // For positions 1-9: Apply daily rotation
      // Use date as seed for consistent daily rotation
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);

      // Rotate the remaining articles with images (positions 1+)
      const rotationOffset = seed % Math.max(1, remainingWithImages.length);
      const rotatedWithImages = [
        ...remainingWithImages.slice(rotationOffset),
        ...remainingWithImages.slice(0, rotationOffset),
      ];

      // Build first page: hero + mix of rotated images and no-images
      // Aim for 5 with images (including hero) and 5 without
      const targetRotatedImagesCount = Math.min(4, rotatedWithImages.length); // 4 more images after hero
      const targetNoImagesCount = Math.min(5, withoutImages.length);

      const firstPageArticles = [
        heroArticle, // Position 0: Locked hero
        ...rotatedWithImages.slice(0, targetRotatedImagesCount), // Positions 1-4: Rotated images
        ...withoutImages.slice(0, targetNoImagesCount), // Positions 5-9: Articles without images
      ].slice(0, firstPageSize);

      // Remaining recent articles + older articles stay in date order
      const remainingRotatedImages = rotatedWithImages.slice(targetRotatedImagesCount);
      const remainingWithoutImages = withoutImages.slice(targetNoImagesCount);

      const remainingRecentArticles = [...remainingRotatedImages, ...remainingWithoutImages]
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
