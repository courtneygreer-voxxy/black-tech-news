import { NewsArticle } from '../news/types';

/**
 * SEO Metadata Generation Utilities
 * Generates unique, keyword-rich metadata for article preview pages
 */

// Common Black tech keywords and topics for SEO enhancement
const BLACK_TECH_KEYWORDS = [
  'Black tech entrepreneurs',
  'Black innovation',
  'diversity in tech',
  'Black founders',
  'Black engineers',
  'tech equity',
  'Black excellence technology',
  'African American tech leaders',
  'Black startups',
  'Black developers',
  'tech inclusion',
  'Black STEM',
  'minority tech professionals',
];

// Category to SEO keyword mapping
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'ai-ml': ['artificial intelligence', 'machine learning', 'AI innovation', 'ML technology', 'neural networks'],
  'startups': ['startup funding', 'venture capital', 'entrepreneurship', 'tech startups', 'seed funding'],
  'innovation': ['tech innovation', 'breakthrough technology', 'emerging tech', 'cutting-edge'],
  'diversity': ['diversity and inclusion', 'tech equity', 'representation in tech', 'inclusive technology'],
  'careers': ['tech careers', 'job opportunities', 'career development', 'tech hiring', 'professional growth'],
  'funding': ['investment', 'venture capital', 'funding rounds', 'startup capital', 'tech investment'],
  'leadership': ['tech leadership', 'executive leadership', 'C-suite', 'tech executives', 'industry leaders'],
  'products': ['product launches', 'new technology', 'tech products', 'product innovation'],
  'culture': ['tech culture', 'workplace culture', 'digital culture', 'tech community'],
  'education': ['tech education', 'STEM education', 'coding bootcamps', 'tech training', 'computer science'],
};

/**
 * Extract relevant keywords from article content
 */
export function extractKeywords(article: NewsArticle): string[] {
  const keywords = new Set<string>();

  // Add category-specific keywords
  const categoryKeywords = CATEGORY_KEYWORDS[article.category] || [];
  categoryKeywords.forEach(kw => keywords.add(kw));

  // Add article tags (already curated)
  article.tags.forEach(tag => keywords.add(tag));

  // Add some general Black tech keywords
  const randomBlackTechKeywords = BLACK_TECH_KEYWORDS
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  randomBlackTechKeywords.forEach(kw => keywords.add(kw));

  // Extract key phrases from title (words longer than 4 chars)
  const titleWords = article.title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4 && !['about', 'their', 'these', 'those', 'which', 'where'].includes(word));

  titleWords.slice(0, 3).forEach(word => keywords.add(word));

  return Array.from(keywords).slice(0, 15); // Limit to 15 keywords
}

/**
 * Generate SEO-optimized title with variations
 */
export function generateSEOTitle(article: NewsArticle): string {
  const categoryLabels: Record<string, string> = {
    'ai-ml': 'AI & ML',
    'startups': 'Startups',
    'innovation': 'Innovation',
    'diversity': 'Diversity',
    'careers': 'Careers',
    'funding': 'Funding',
    'leadership': 'Leadership',
    'products': 'Products',
    'culture': 'Culture',
    'education': 'Education',
  };

  const categoryLabel = categoryLabels[article.category] || 'Tech News';

  // Create variations based on title length
  const baseTitle = article.title;
  const maxTitleLength = 60; // SEO best practice

  if (baseTitle.length <= maxTitleLength) {
    // Short titles: add category and brand
    return `${baseTitle} | ${categoryLabel} - Black Tech News`;
  } else {
    // Long titles: just add brand
    return `${baseTitle} | Black Tech News`;
  }
}

/**
 * Generate unique, SEO-optimized meta description
 */
export function generateMetaDescription(article: NewsArticle): string {
  const maxLength = 155; // SEO best practice

  // Extract first sentence from excerpt or first 150 chars
  let description = article.excerpt || article.content || article.title;

  // Add context and keywords
  const categoryContext: Record<string, string> = {
    'ai-ml': 'Explore the latest in artificial intelligence and machine learning',
    'startups': 'Discover innovative Black-founded startups and entrepreneurship',
    'innovation': 'Stay updated on groundbreaking technology and innovation',
    'diversity': 'Learn about diversity, equity, and inclusion in tech',
    'careers': 'Find opportunities and insights for tech career growth',
    'funding': 'Track venture capital and startup funding in Black tech',
    'leadership': 'Follow Black tech leaders shaping the industry',
    'products': 'Discover new tech products and launches',
    'culture': 'Explore tech culture and digital innovation',
    'education': 'Access tech education resources and STEM opportunities',
  };

  const context = categoryContext[article.category] || 'Stay informed about Black excellence in technology';

  // Combine context with excerpt
  const combined = `${context}. ${description}`;

  // Trim to max length while preserving word boundaries
  if (combined.length <= maxLength) {
    return combined;
  }

  const trimmed = combined.substring(0, maxLength - 3);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.substring(0, lastSpace) + '...';
}

/**
 * Generate Open Graph image URL
 * Falls back to default if article has no image
 */
export function generateOGImage(article: NewsArticle): string {
  return article.imageUrl || 'https://blacktechnews.com/og-default.png';
}

/**
 * Generate complete SEO metadata for an article
 */
export interface ArticleSEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  author?: string;
  publishedTime: string;
  category: string;
  tags: string[];
}

export function generateArticleSEOMetadata(
  article: NewsArticle,
  articleUrl: string
): ArticleSEOMetadata {
  const title = generateSEOTitle(article);
  const description = generateMetaDescription(article);
  const keywords = extractKeywords(article);
  const ogImage = generateOGImage(article);

  return {
    // Basic meta
    title,
    description,
    keywords,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: articleUrl,

    // Twitter Card
    twitterCard: article.imageUrl ? 'summary_large_image' : 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,

    // SEO
    canonicalUrl: articleUrl, // Point to our preview page as canonical
    author: article.author,
    publishedTime: article.publishedAt.toISOString(),
    category: article.category,
    tags: article.tags,
  };
}
