import { fetchArticles } from '@/lib/api/articles';
import ArticlePreviewClient from '@/components/ArticlePreviewClient';
import type { Metadata } from 'next';

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const articles = await fetchArticles(50);
    // Return encoded IDs for static export to generate correct file paths
    return articles.map((article) => ({
      id: encodeURIComponent(article.id),
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
  // Decode the URL-encoded ID to match the original article IDs
  const decodedId = decodeURIComponent(id);
  console.log('[Server] Article preview page requested for ID:', id);
  console.log('[Server] Decoded ID:', decodedId);
  return <ArticlePreviewClient articleId={decodedId} />;
}
