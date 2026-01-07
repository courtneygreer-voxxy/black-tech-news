import { MetadataRoute } from 'next';
import { fetchArticlesForBuild } from '@/lib/api/articles';
import { encodeArticleId } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blacktechnews.com';

  // Fetch all articles for sitemap
  const articles = await fetchArticlesForBuild(50);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/article/${encodeArticleId(article.id)}`,
    lastModified: article.publishedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
