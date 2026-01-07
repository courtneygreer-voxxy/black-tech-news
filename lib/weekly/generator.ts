import { NewsArticle } from '../news/types';
import {
  WeeklyDigest,
  WeeklyStory,
  TrendingTopic,
  WeeklyDigestMetadata,
} from './types';

/**
 * Weekly Digest Generator
 *
 * Uses AI to analyze articles and generate structured weekly summaries
 * Optimized for SEO, LLM parsing, and educational institution targeting
 */

/**
 * Analyze articles and generate a weekly theme
 * This will be replaced with Claude API call in production
 */
export async function generateWeeklyTheme(articles: NewsArticle[]): Promise<string> {
  // For MVP, we'll create a rule-based theme generator
  // TODO: Replace with Claude API call for production

  const categories = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const categoryName = topCategory[0];
  const count = topCategory[1];

  // Generate theme based on dominant topics
  const theme = `This week in Black tech showcased remarkable momentum across multiple sectors.

With ${articles.length} stories highlighting Black excellence in technology, ${categoryName} emerged as the dominant theme with ${count} key developments. From innovative startups securing major funding rounds to groundbreaking AI applications reshaping industries, Black founders and technologists continue driving transformative change.

For students and young professionals, these stories reveal critical industry trends and emerging career opportunities. The funding landscape remains active with Black-founded companies attracting significant investment, while established tech leaders advance into new markets. This week's news underscores the importance of staying informed about the rapidly evolving tech ecosystem where Black innovation leads the way.`;

  return theme;
}

/**
 * Extract key insight from an article
 */
export function generateKeyInsight(article: NewsArticle): string {
  // Simple rule-based insight generation
  const category = article.category;

  if (category === 'startups-funding') {
    return 'Major funding milestone for Black-founded startup ecosystem';
  } else if (category === 'careers-opportunities') {
    return 'New career opportunities for tech professionals';
  } else if (category === 'innovation-products') {
    return 'Innovation expanding opportunities in emerging tech';
  } else if (category === 'community-events') {
    return 'Community engagement strengthening Black tech networks';
  } else if (category === 'policy-impact') {
    return 'Policy developments impacting tech diversity and inclusion';
  }

  return 'Significant development in Black tech innovation';
}

/**
 * Generate "Why It Matters" content for students/professionals
 */
export function generateWhyItMatters(article: NewsArticle): string {
  const category = article.category;

  const templates: Record<string, string> = {
    'startups-funding': 'For students: Learn about startup ecosystem and fundraising. For professionals: Understand investment trends. For founders: Benchmark fundraising strategies and investor expectations.',
    'careers-opportunities': 'For students: Direct pathway to tech opportunities. For professionals: Career advancement strategies. For founders: Hiring trends and talent insights for building teams.',
    'innovation-products': 'For students: Explore emerging tech fields and career paths. For professionals: Identify skill-building areas. For founders: Spot market opportunities and product trends.',
    'community-events': 'For students: Networking and learning opportunities. For professionals: Community engagement and professional development. For founders: Partnership and collaboration possibilities.',
    'policy-impact': 'For students: Understand how policy shapes tech careers. For professionals: Navigate regulatory landscapes. For founders: Anticipate policy impacts on business strategy.',
    general: 'For students: General tech industry insights. For professionals: Market awareness. For founders: Strategic context for decision-making.',
  };

  return templates[category] || 'Provides valuable insights for tech students, professionals, and founders in the Black tech community.';
}

/**
 * Extract trending topics from articles
 */
export function extractTrendingTopics(articles: NewsArticle[]): TrendingTopic[] {
  const topicMap = new Map<string, { category: string; count: number; keywords: Set<string> }>();

  articles.forEach((article) => {
    const topicName = getCategoryDisplayName(article.category);
    const existing = topicMap.get(topicName);

    if (existing) {
      existing.count++;
      article.tags.forEach((tag) => existing.keywords.add(tag));
    } else {
      topicMap.set(topicName, {
        category: article.category,
        count: 1,
        keywords: new Set(article.tags.slice(0, 5)),
      });
    }
  });

  return Array.from(topicMap.entries())
    .map(([name, data]) => ({
      name,
      category: data.category,
      articleCount: data.count,
      keywords: Array.from(data.keywords).slice(0, 8),
    }))
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 8);
}

/**
 * Get display name for category
 */
function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    'startups-funding': 'Startups & Funding',
    'careers-opportunities': 'Careers & Opportunities',
    'innovation-products': 'Innovation & Products',
    'community-events': 'Community & Events',
    'policy-impact': 'Policy & Impact',
    general: 'General Tech News',
  };
  return names[category] || category;
}

/**
 * Generate SEO metadata for weekly digest
 */
export function generateWeeklyMetadata(
  weekStart: Date,
  weekEnd: Date,
  articles: NewsArticle[]
): WeeklyDigestMetadata {
  const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const title = `Black Tech News Weekly: ${startStr} - ${endStr} | Top Stories & Trends`;
  const description = `This week's essential Black tech news digest: ${articles.length} curated stories featuring startup funding, career opportunities, AI innovations, and Black founders. Perfect for students, professionals, and entrepreneurs.`;

  const keywords = [
    'Black tech weekly digest',
    `Black tech news ${weekEnd.getFullYear()}`,
    'HBCU tech opportunities',
    'Black founders news',
    'tech career opportunities',
    'Black tech startups',
    'diverse tech leaders',
    'tech industry trends',
    'Black innovation',
    'tech weekly summary',
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    datePublished: weekEnd.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Black Tech News',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Black Tech News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blacktechnews.com/logo.png',
      },
    },
  };

  return {
    seoTitle: title,
    seoDescription: description,
    keywords,
    structuredData,
  };
}

/**
 * Generate complete weekly digest
 */
export async function generateWeeklyDigest(
  weekStart: Date,
  weekEnd: Date,
  articles: NewsArticle[]
): Promise<WeeklyDigest> {
  // Sort articles by relevance/views (for now, by date)
  const sortedArticles = [...articles]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 15); // Top 15 stories

  // Generate theme
  const theme = await generateWeeklyTheme(sortedArticles);

  // Create weekly stories
  const topStories: WeeklyStory[] = sortedArticles.map((article, index) => ({
    article,
    rank: index + 1,
    keyInsight: generateKeyInsight(article),
    whyItMatters: generateWhyItMatters(article),
  }));

  // Extract trending topics
  const trendingTopics = extractTrendingTopics(articles);

  // Generate metadata
  const metadata = generateWeeklyMetadata(weekStart, weekEnd, articles);

  // Format digest ID as ISO week start (Monday)
  const monday = new Date(weekStart);
  monday.setDate(monday.getDate() + 1); // Sunday -> Monday
  const digestId = monday.toISOString().split('T')[0];

  const startStr = weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const endStr = weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return {
    id: digestId,
    weekStart,
    weekEnd,
    title: `Black Tech News Weekly: ${startStr} - ${endStr}`,
    theme,
    topStories,
    trendingTopics,
    articleCount: articles.length,
    generatedAt: new Date(),
    metadata,
  };
}

/**
 * Get week bounds (Sunday to Saturday)
 */
export function getWeekBounds(date: Date = new Date()): { weekStart: Date; weekEnd: Date } {
  const current = new Date(date);
  const dayOfWeek = current.getDay(); // 0 = Sunday

  // Get Sunday of this week
  const weekStart = new Date(current);
  weekStart.setDate(current.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  // Get Saturday of this week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

/**
 * Get previous week bounds
 */
export function getPreviousWeekBounds(): { weekStart: Date; weekEnd: Date } {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  return getWeekBounds(lastWeek);
}
