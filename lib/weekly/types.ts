import { NewsArticle } from '../news/types';

/**
 * Weekly Digest Types
 *
 * Represents a curated weekly summary of Black tech news
 * Optimized for SEO, AI parsing, and citation velocity
 */

export interface WeeklyDigest {
  id: string; // Format: YYYY-MM-DD (Monday of the week)
  weekStart: Date; // Sunday 00:00
  weekEnd: Date; // Saturday 23:59
  title: string; // "Black Tech News Weekly: January 6-12, 2026"
  theme: string; // AI-generated 2-3 paragraph analysis
  topStories: WeeklyStory[];
  trendingTopics: TrendingTopic[];
  articleCount: number;
  generatedAt: Date;
  metadata: WeeklyDigestMetadata;
}

export interface WeeklyStory {
  article: NewsArticle;
  rank: number; // 1-10
  keyInsight: string; // 1-sentence takeaway
  whyItMatters: string; // Career/industry impact
  relatedArticles?: string[]; // IDs of related articles
}

export interface TrendingTopic {
  name: string; // "AI & Machine Learning"
  category: string; // Article category
  articleCount: number;
  keywords: string[];
}

export interface WeeklyDigestMetadata {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  ogImage?: string;
  structuredData: any; // JSON-LD
}

export interface GenerateWeeklyDigestRequest {
  weekStart: string; // ISO date (Sunday)
  weekEnd: string; // ISO date (Saturday)
  limit?: number; // Number of articles to analyze (default: 50)
}

export interface GenerateWeeklyDigestResponse {
  success: boolean;
  digest?: WeeklyDigest;
  error?: string;
  message?: string;
}
