import { NewsArticle } from '../news/types';

/**
 * Monthly Report Types
 * "State of Black Tech" - Comprehensive monthly analysis
 */

export interface MonthlyReport {
  id: string; // Format: YYYY-MM (e.g., "2026-01")
  monthStart: Date;
  monthEnd: Date;
  title: string;
  executiveSummary: string;

  // Core sections
  fundingAnalysis: FundingAnalysis;
  talentTrends: TalentTrends;
  innovationHighlights: InnovationHighlights;
  communityImpact: CommunityImpact;
  outlook: MonthlyOutlook;

  // Metadata
  articleCount: number;
  topStories: MonthlyStory[];
  generatedAt: Date;
  metadata: MonthlyReportMetadata;
}

export interface MonthlyStory {
  article: NewsArticle;
  rank: number;
  impact: 'transformative' | 'significant' | 'notable';
  keyTakeaway: string;
  relevanceScore: number;
}

export interface FundingAnalysis {
  totalDeals: number;
  fundingStages: {
    seed: number;
    seriesA: number;
    seriesB: number;
    seriesCPlus: number;
  };
  topSectors: Array<{
    name: string;
    dealCount: number;
    percentage: number;
  }>;
  notableDeals: Array<{
    company: string;
    amount?: string;
    stage?: string;
    sector: string;
  }>;
  monthOverMonthTrend: 'increasing' | 'stable' | 'decreasing';
  insights: string[];
}

export interface TalentTrends {
  jobOpportunities: number;
  topRoles: Array<{
    title: string;
    count: number;
    avgSalaryRange?: string;
  }>;
  topCompanies: Array<{
    name: string;
    openings: number;
    focus: string;
  }>;
  emergingSkills: string[];
  insights: string[];
}

export interface InnovationHighlights {
  productLaunches: number;
  aiMlDevelopments: number;
  techBreakthroughs: Array<{
    title: string;
    category: string;
    description: string;
  }>;
  emergingTrends: string[];
  insights: string[];
}

export interface CommunityImpact {
  eventsHosted: number;
  partnershipsFormed: number;
  educationalInitiatives: Array<{
    name: string;
    type: string;
    reach?: string;
  }>;
  hbcuHighlights: string[];
  insights: string[];
}

export interface MonthlyOutlook {
  keyTrends: string[];
  opportunitiesAhead: string[];
  watchList: Array<{
    area: string;
    description: string;
    relevance: string;
  }>;
  studentFocus: string;
  professionalFocus: string;
  founderFocus: string;
}

export interface MonthlyReportMetadata {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  structuredData: Record<string, unknown>;
}
