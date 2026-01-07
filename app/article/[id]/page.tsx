import { fetchArticlesForBuild } from '@/lib/api/articles';
import ArticlePreviewClient from '@/components/ArticlePreviewClient';
import { encodeArticleId, decodeArticleId } from '@/lib/utils';
import { generateArticleSEOMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const articles = await fetchArticlesForBuild(50);
    // Encode article IDs to URL-safe format (base64url)
    return articles.map((article) => ({
      id: encodeArticleId(article.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate SEO-optimized metadata for each article preview page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;

    // Decode the article ID
    const articleId = decodeArticleId(id);

    // Fetch all articles to find this one (using build-time cached fetch)
    const articles = await fetchArticlesForBuild(50);
    const article = articles.find(a => a.id === articleId);

    if (!article) {
      // Fallback metadata if article not found
      return {
        title: 'Article Not Found | Black Tech News',
        description: 'Celebrating Black Excellence in Technology, Startups, and Digital Culture',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    // Generate full SEO metadata
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blacktechnews.com';
    const articleUrl = `${baseUrl}/article/${id}`;
    const seoMetadata = generateArticleSEOMetadata(article, articleUrl);

    return {
      title: seoMetadata.title,
      description: seoMetadata.description,
      keywords: seoMetadata.keywords,
      authors: seoMetadata.author ? [{ name: seoMetadata.author }] : undefined,

      // Allow indexing for SEO
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Open Graph
      openGraph: {
        type: 'article',
        title: seoMetadata.ogTitle,
        description: seoMetadata.ogDescription,
        url: seoMetadata.ogUrl,
        siteName: 'Black Tech News',
        images: [
          {
            url: seoMetadata.ogImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        publishedTime: seoMetadata.publishedTime,
        authors: seoMetadata.author ? [seoMetadata.author] : undefined,
        tags: seoMetadata.tags,
      },

      // Twitter Card
      twitter: {
        card: seoMetadata.twitterCard,
        title: seoMetadata.twitterTitle,
        description: seoMetadata.twitterDescription,
        images: [seoMetadata.twitterImage],
        creator: '@BlackTechNews', // Update with your Twitter handle
        site: '@BlackTechNews',
      },

      // Other metadata
      alternates: {
        canonical: seoMetadata.canonicalUrl,
      },

      // Category classification
      category: seoMetadata.category,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Black Tech News',
      description: 'Celebrating Black Excellence in Technology, Startups, and Digital Culture',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
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
