export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  source: NewsSource;
  category: NewsCategory;
  tags: string[];
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'scrape';
  logoUrl?: string;
  filterBlackTech?: boolean; // Filter for Black tech content from general sources
}

export type NewsCategory =
  | 'startups-funding'
  | 'careers-opportunities'
  | 'innovation-products'
  | 'community-events'
  | 'policy-impact'
  | 'general';

export interface ScraperConfig {
  url: string;
  selectors: {
    article: string;
    title: string;
    link: string;
    excerpt?: string;
    image?: string;
    date?: string;
    author?: string;
  };
}
