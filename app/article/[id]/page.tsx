import { fetchArticles } from '@/lib/api/articles';
import ArticlePreviewClient from '@/components/ArticlePreviewClient';
import type { Metadata } from 'next';

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const articles = await fetchArticles(50);
    // Return raw IDs - Next.js will handle URL encoding automatically
    return articles.map((article) => ({
      id: article.id,
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
  console.log('[Server] Received ID from URL params:', id);
  console.log('[Server] ID type:', typeof id);
  console.log('[Server] ID length:', id.length);

  // Decode the URL-encoded ID to match the original article IDs
  const decodedId = decodeURIComponent(id);
  console.log('[Server] Decoded ID:', decodedId);
  console.log('[Server] Decoded ID length:', decodedId.length);
  console.log('[Server] =====================================');

  return <ArticlePreviewClient articleId={decodedId} />;
}
