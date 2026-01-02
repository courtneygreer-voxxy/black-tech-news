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

    // Black Tech News custom sorting: prioritize articles with images
    articles.sort((a, b) => {
      const aHasImage = a.imageUrl ? 1 : 0;
      const bHasImage = b.imageUrl ? 1 : 0;

      // If one has image and other doesn't, prioritize the one with image
      if (aHasImage !== bHasImage) {
        return bHasImage - aHasImage;
      }

      // Both have images or both don't have images, sort by date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

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
