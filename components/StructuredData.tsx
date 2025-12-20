import { NewsArticle } from '@/lib/news/types';

interface StructuredDataProps {
  articles: NewsArticle[];
}

export default function StructuredData({ articles }: StructuredDataProps) {
  // Website structured data
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Black Tech News',
    alternateName: 'BTN - Black Tech News',
    description:
      'Daily curated technology news focused on Black professionals, startups, and innovation in the tech industry.',
    url: 'https://blacktechnews.cc',
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Black Technology Professionals',
      description:
        'News, opportunities, and insights for Black professionals in technology',
    },
    keywords: [
      'black tech news',
      'black tech professionals',
      'black entrepreneurs',
      'diversity in tech',
      'black founders',
      'HBCU technology',
      'afrotech',
      'people of color in tech',
      'black innovation',
      'tech diversity',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://blacktechnews.cc?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Organization structured data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Black Tech News',
    alternateName: 'BTN',
    description: 'The News You Need to Know - Daily curated technology news for Black professionals',
    url: 'https://blacktechnews.cc',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blacktechnews.cc/og-image.png',
      width: 1200,
      height: 630,
    },
    foundingDate: '2025',
    sameAs: [],
  };

  // Collection of articles for discovery
  const collectionData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.slice(0, 10).map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        image: article.imageUrl,
        datePublished: article.publishedAt,
        author: {
          '@type': article.author ? 'Person' : 'Organization',
          name: article.author || article.source.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Black Tech News',
        },
        about: {
          '@type': 'Thing',
          name: 'Black Technology and Innovation',
        },
        keywords: article.tags.join(', '),
        url: article.url,
        isAccessibleForFree: true,
      },
    })),
  };

  return (
    <>
      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />

      {/* Article Collection Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionData) }}
      />
    </>
  );
}
