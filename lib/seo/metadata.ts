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

// Education-focused keywords targeting HBCUs and young professionals
const EDUCATION_KEYWORDS = [
  'tech careers for students',
  'HBCU tech opportunities',
  'Black tech professionals',
  'career advice for graduates',
  'tech industry trends',
  'internship opportunities',
  'professional development',
  'tech jobs for new graduates',
  'career resources',
  'tech industry insights',
  'STEM careers',
  'young professionals in tech',
];

// Category to SEO keyword mapping (enhanced for educational institutions)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'ai-ml': ['artificial intelligence careers', 'machine learning jobs', 'AI innovation', 'ML technology', 'AI career paths'],
  'startups': ['startup opportunities', 'venture capital', 'entrepreneurship for students', 'Black-founded startups', 'startup careers'],
  'innovation': ['tech innovation', 'breakthrough technology', 'emerging tech careers', 'cutting-edge technology'],
  'diversity': ['diversity and inclusion', 'tech equity', 'representation in tech', 'inclusive workplaces', 'DEI careers'],
  'careers': ['tech careers', 'job opportunities', 'career development', 'tech hiring', 'professional growth', 'entry-level tech jobs'],
  'funding': ['investment news', 'venture capital', 'funding rounds', 'startup funding', 'Black founders investment'],
  'leadership': ['tech leadership', 'career advancement', 'tech executives', 'industry leaders', 'leadership development'],
  'products': ['product launches', 'new technology', 'tech products', 'product innovation', 'tech trends'],
  'culture': ['tech culture', 'workplace culture', 'digital culture', 'tech community', 'company culture'],
  'education': ['tech education', 'STEM education', 'coding bootcamps', 'tech training', 'computer science degrees', 'HBCU tech programs'],
};

/**
 * Extract relevant keywords from article content
 * Enhanced with education-focused keywords for HBCU and student targeting
 */
export function extractKeywords(article: NewsArticle): string[] {
  const keywords = new Set<string>();

  // Add category-specific keywords
  const categoryKeywords = CATEGORY_KEYWORDS[article.category] || [];
  categoryKeywords.forEach(kw => keywords.add(kw));

  // Add article tags (already curated)
  article.tags.forEach(tag => keywords.add(tag));

  // Add education-focused keywords for student/HBCU targeting (2-3 per article)
  const educationCategories = ['careers', 'startups', 'leadership', 'innovation', 'education', 'funding'];
  if (educationCategories.includes(article.category)) {
    const randomEducationKeywords = EDUCATION_KEYWORDS
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    randomEducationKeywords.forEach(kw => keywords.add(kw));
  }

  // Add some general Black tech keywords
  const randomBlackTechKeywords = BLACK_TECH_KEYWORDS
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
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
 * Enhanced for educational institution targeting
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

  // Education-focused suffixes for relevant categories
  const educationSuffixes: Record<string, string> = {
    'careers': 'Tech Careers',
    'startups': 'Startup News',
    'leadership': 'Career Insights',
    'innovation': 'Tech Trends',
    'education': 'STEM Education',
    'funding': 'Startup Funding',
  };

  const categoryLabel = categoryLabels[article.category] || 'Tech News';
  const educationLabel = educationSuffixes[article.category];

  // Create variations based on title length and category
  const baseTitle = article.title;
  const maxTitleLength = 60; // SEO best practice

  if (baseTitle.length <= maxTitleLength) {
    // For education-relevant categories, use student-focused suffix
    if (educationLabel) {
      return `${baseTitle} | ${educationLabel} - Black Tech News`;
    }
    // Short titles: add category and brand
    return `${baseTitle} | ${categoryLabel} - Black Tech News`;
  } else {
    // Long titles: just add brand
    return `${baseTitle} | Black Tech News`;
  }
}

/**
 * Generate unique, SEO-optimized meta description
 * Enhanced with student and young professional messaging
 */
export function generateMetaDescription(article: NewsArticle): string {
  const maxLength = 155; // SEO best practice

  // Extract first sentence from excerpt or first 150 chars
  let description = article.excerpt || article.content || article.title;

  // Add context and keywords (enhanced for education targeting)
  const categoryContext: Record<string, string> = {
    'ai-ml': 'Essential tech news for students and professionals: Explore AI and machine learning',
    'startups': 'Career insights for aspiring founders: Discover innovative Black-founded startups',
    'innovation': 'Tech trends for young professionals: Stay updated on groundbreaking technology',
    'diversity': 'Building inclusive careers: Learn about diversity, equity, and inclusion in tech',
    'careers': 'Career resources for tech students: Find opportunities and insights for growth',
    'funding': 'Startup funding news for entrepreneurs: Track venture capital in Black tech',
    'leadership': 'Professional development insights: Follow Black tech leaders shaping the industry',
    'products': 'Latest tech innovations: Discover new products and launches',
    'culture': 'Tech workplace culture: Explore digital innovation and community',
    'education': 'STEM education and career resources: Access opportunities for students',
  };

  const context = categoryContext[article.category] || 'Essential tech news for students and young professionals in Black tech';

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
