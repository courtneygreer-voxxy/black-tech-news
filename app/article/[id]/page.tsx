import { fetchArticles } from '@/lib/api/articles';
import ArticlePreviewClient from '@/components/ArticlePreviewClient';
import { encodeArticleId } from '@/lib/utils';
import type { Metadata } from 'next';

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const articles = await fetchArticles(50);
    // Encode article IDs to URL-safe format (base64url)
    return articles.map((article) => ({
      id: encodeArticleId(article.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for preview pages (noindex)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}

// Server component wrapper
export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('[Server] ===== ARTICLE PREVIEW PAGE =====');
  console.log('[Server] Received encoded ID from URL params:', id);
  console.log('[Server] ID type:', typeof id);
  console.log('[Server] ID length:', id.length);

  // Decode the base64url-encoded ID to get original article ID
  const { decodeArticleId } = await import('@/lib/utils');
  const articleId = decodeArticleId(id);
  console.log('[Server] Decoded article ID:', articleId);
  console.log('[Server] Decoded ID length:', articleId.length);
  console.log('[Server] =====================================');

  return <ArticlePreviewClient articleId={articleId} />;
}
