import { query } from './client';
import { NewsArticle, NewsSource } from '../news/types';

export interface DBArticle {
  id: number;
  external_id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  url: string;
  image_url: string | null;
  author: string | null;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  source_id: string;
  source_name: string;
  category: string;
  tags: string[];
  view_count: number;
  is_featured: boolean;
  is_active: boolean;
}

// Convert DB article to NewsArticle format
export function dbArticleToNewsArticle(dbArticle: DBArticle): NewsArticle {
  return {
    id: dbArticle.external_id,
    title: dbArticle.title,
    excerpt: dbArticle.excerpt || '',
    content: dbArticle.content || undefined,
    url: dbArticle.url,
    imageUrl: dbArticle.image_url || undefined,
    author: dbArticle.author || undefined,
    publishedAt: dbArticle.published_at,
    source: {
      id: dbArticle.source_id,
      name: dbArticle.source_name,
      url: '', // Not stored in DB article
      type: 'rss', // Default
    },
    category: dbArticle.category as any,
    tags: dbArticle.tags || [],
  };
}

// Get all articles (paginated)
export async function getArticles(
  limit: number = 50,
  offset: number = 0
): Promise<NewsArticle[]> {
  const rows = await query<DBArticle>(
    `SELECT * FROM articles
     WHERE is_active = true
     ORDER BY published_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows.map(dbArticleToNewsArticle);
}

// Get featured articles
export async function getFeaturedArticles(limit: number = 5): Promise<NewsArticle[]> {
  const rows = await query<DBArticle>(
    `SELECT * FROM articles
     WHERE is_active = true AND is_featured = true
     ORDER BY published_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows.map(dbArticleToNewsArticle);
}

// Get articles by category
export async function getArticlesByCategory(
  category: string,
  limit: number = 50
): Promise<NewsArticle[]> {
  const rows = await query<DBArticle>(
    `SELECT * FROM articles
     WHERE is_active = true AND category = $1
     ORDER BY published_at DESC
     LIMIT $2`,
    [category, limit]
  );
  return rows.map(dbArticleToNewsArticle);
}

// Insert or update an article
export async function upsertArticle(article: NewsArticle): Promise<void> {
  await query(
    `INSERT INTO articles (
      external_id, title, excerpt, content, url, image_url, author,
      published_at, source_id, source_name, category, tags
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (url) DO UPDATE SET
      title = EXCLUDED.title,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      image_url = EXCLUDED.image_url,
      author = EXCLUDED.author,
      published_at = EXCLUDED.published_at,
      category = EXCLUDED.category,
      tags = EXCLUDED.tags,
      updated_at = CURRENT_TIMESTAMP`,
    [
      article.id,
      article.title,
      article.excerpt,
      article.content || null,
      article.url,
      article.imageUrl || null,
      article.author || null,
      article.publishedAt,
      article.source.id,
      article.source.name,
      article.category,
      article.tags,
    ]
  );
}

// Bulk insert articles
export async function bulkUpsertArticles(articles: NewsArticle[]): Promise<void> {
  for (const article of articles) {
    await upsertArticle(article);
  }
}

// Increment view count
export async function incrementViewCount(articleUrl: string): Promise<void> {
  await query(
    `UPDATE articles SET view_count = view_count + 1 WHERE url = $1`,
    [articleUrl]
  );
}

// Mark article as featured
export async function setFeaturedArticle(articleUrl: string, isFeatured: boolean): Promise<void> {
  await query(
    `UPDATE articles SET is_featured = $1 WHERE url = $2`,
    [isFeatured, articleUrl]
  );
}

// Delete old articles (cleanup)
export async function deleteOldArticles(daysOld: number = 90): Promise<number> {
  const result = await query(
    `DELETE FROM articles
     WHERE published_at < NOW() - INTERVAL '1 day' * $1
     RETURNING id`,
    [daysOld]
  );
  return result.length;
}
