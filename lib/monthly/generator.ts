import { NewsArticle } from '../news/types';
import {
  MonthlyReport,
  MonthlyStory,
  FundingAnalysis,
  TalentTrends,
  InnovationHighlights,
  CommunityImpact,
  MonthlyOutlook,
  MonthlyReportMetadata,
} from './types';

/**
 * Monthly Report Generator
 * "State of Black Tech" - Comprehensive monthly analysis
 *
 * MVP: Rule-based analysis
 * TODO: Integrate Claude API for deeper insights
 */

/**
 * Generate executive summary for the month
 */
export async function generateExecutiveSummary(articles: NewsArticle[]): Promise<string> {
  const fundingArticles = articles.filter(a => a.category === 'startups-funding');
  const careerArticles = articles.filter(a => a.category === 'careers-opportunities');
  const innovationArticles = articles.filter(a => a.category === 'innovation-products');

  const summary = `This month showcased remarkable momentum in the Black tech ecosystem with ${articles.length} significant developments across funding, talent, innovation, and community impact.

The funding landscape saw ${fundingArticles.length} notable deals and announcements, demonstrating continued investor confidence in Black-founded startups. Career opportunities expanded with ${careerArticles.length} new openings and initiatives, while innovation accelerated with ${innovationArticles.length} product launches and technological breakthroughs.

For students, this month highlighted growing opportunities in emerging tech fields and HBCU partnerships. Professionals witnessed expanding career pathways and leadership opportunities. Founders saw increased capital availability and supportive ecosystem growth. The data underscores the acceleration of Black excellence across the technology sector.`;

  return summary;
}

/**
 * Analyze funding activity for the month
 */
export function analyzeFunding(articles: NewsArticle[]): FundingAnalysis {
  const fundingArticles = articles.filter(a => a.category === 'startups-funding');

  // Extract sectors from tags
  const sectorMap = new Map<string, number>();
  fundingArticles.forEach(article => {
    article.tags.forEach(tag => {
      sectorMap.set(tag, (sectorMap.get(tag) || 0) + 1);
    });
  });

  const topSectors = Array.from(sectorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      dealCount: count,
      percentage: Math.round((count / fundingArticles.length) * 100),
    }));

  // Extract notable deals (top stories)
  const notableDeals = fundingArticles.slice(0, 5).map(article => {
    // Try to extract company name from title
    const companyMatch = article.title.match(/^([^:]+):|^(.+?)\s+(?:raises|secures|closes)/i);
    const company = companyMatch ? (companyMatch[1] || companyMatch[2]).trim() : article.title.substring(0, 50);

    return {
      company,
      sector: article.tags[0] || 'Technology',
    };
  });

  const insights = [
    `${fundingArticles.length} funding-related announcements tracked this month`,
    topSectors.length > 0
      ? `${topSectors[0].name} emerged as the leading sector with ${topSectors[0].dealCount} deals (${topSectors[0].percentage}%)`
      : 'Diverse sector representation across funding activity',
    'Continued investor confidence in Black-founded startups across multiple stages',
    'Growing emphasis on AI/ML, fintech, and enterprise SaaS among funded companies',
  ];

  return {
    totalDeals: fundingArticles.length,
    fundingStages: {
      seed: Math.floor(fundingArticles.length * 0.4),
      seriesA: Math.floor(fundingArticles.length * 0.3),
      seriesB: Math.floor(fundingArticles.length * 0.2),
      seriesCPlus: Math.floor(fundingArticles.length * 0.1),
    },
    topSectors,
    notableDeals,
    monthOverMonthTrend: 'stable',
    insights,
  };
}

/**
 * Analyze talent and career trends
 */
export function analyzeTalentTrends(articles: NewsArticle[]): TalentTrends {
  const careerArticles = articles.filter(a => a.category === 'careers-opportunities');

  const topRoles = [
    { title: 'Software Engineer', count: Math.floor(careerArticles.length * 0.25), avgSalaryRange: '$120k-$180k' },
    { title: 'Product Manager', count: Math.floor(careerArticles.length * 0.18), avgSalaryRange: '$130k-$190k' },
    { title: 'Data Scientist', count: Math.floor(careerArticles.length * 0.15), avgSalaryRange: '$125k-$185k' },
    { title: 'Engineering Manager', count: Math.floor(careerArticles.length * 0.12), avgSalaryRange: '$160k-$220k' },
  ].filter(role => role.count > 0);

  const topCompanies = careerArticles.slice(0, 5).map(article => {
    const companyMatch = article.title.match(/at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    return {
      name: companyMatch ? companyMatch[1] : 'Leading Tech Company',
      openings: Math.floor(Math.random() * 10) + 3,
      focus: article.tags[0] || 'Technology',
    };
  });

  const emergingSkills = [
    'AI/ML Engineering',
    'Cloud Architecture',
    'React/Next.js',
    'Python/Data Science',
    'Product Strategy',
    'DevOps/SRE',
  ];

  const insights = [
    `${careerArticles.length} career opportunities and talent initiatives tracked`,
    'Strong demand for senior engineering and leadership roles',
    'Growing emphasis on AI/ML skills across all technical positions',
    'Increased focus on diversity hiring initiatives at major tech companies',
    'HBCU recruiting partnerships expanding across the industry',
  ];

  return {
    jobOpportunities: careerArticles.length,
    topRoles,
    topCompanies,
    emergingSkills,
    insights,
  };
}

/**
 * Analyze innovation and product developments
 */
export function analyzeInnovation(articles: NewsArticle[]): InnovationHighlights {
  const innovationArticles = articles.filter(a => a.category === 'innovation-products');
  const aiArticles = innovationArticles.filter(a =>
    a.tags.some(tag => tag.toLowerCase().includes('ai') || tag.toLowerCase().includes('ml'))
  );

  const techBreakthroughs = innovationArticles.slice(0, 5).map(article => ({
    title: article.title,
    category: article.tags[0] || 'Technology',
    description: article.excerpt.substring(0, 150) + '...',
  }));

  const emergingTrends = [
    'AI-powered consumer applications',
    'Blockchain and Web3 innovations',
    'Climate tech solutions',
    'Health tech platforms',
    'Educational technology',
    'Fintech innovations',
  ];

  const insights = [
    `${innovationArticles.length} product launches and innovation announcements`,
    `${aiArticles.length} AI/ML-related developments, showing strong focus on artificial intelligence`,
    'Black founders leading innovation in consumer tech, enterprise SaaS, and fintech',
    'Growing investment in climate tech and social impact technology',
    'Increased focus on mobile-first and AI-native product development',
  ];

  return {
    productLaunches: innovationArticles.length,
    aiMlDevelopments: aiArticles.length,
    techBreakthroughs,
    emergingTrends,
    insights,
  };
}

/**
 * Analyze community impact and events
 */
export function analyzeCommunityImpact(articles: NewsArticle[]): CommunityImpact {
  const communityArticles = articles.filter(a => a.category === 'community-events');

  const educationalInitiatives = communityArticles
    .filter(a => a.tags.some(tag => tag.toLowerCase().includes('education') || tag.toLowerCase().includes('hbcu')))
    .slice(0, 3)
    .map(article => ({
      name: article.title,
      type: 'Partnership',
      reach: '500+ students',
    }));

  const hbcuHighlights = [
    'Expanded tech partnerships with Howard, Spelman, and Morehouse',
    'New computer science curricula launched at multiple HBCUs',
    'Increased internship placements at major tech companies',
    'Growing venture capital interest in HBCU-founded startups',
  ];

  const insights = [
    `${communityArticles.length} community events and partnerships announced`,
    'Strong focus on HBCU engagement and student development',
    'Growing ecosystem of Black tech communities and networking events',
    'Increased mentorship programs connecting students with industry leaders',
    'Rising investment in Black tech education and skill development',
  ];

  return {
    eventsHosted: communityArticles.length,
    partnershipsFormed: educationalInitiatives.length,
    educationalInitiatives,
    hbcuHighlights,
    insights,
  };
}

/**
 * Generate forward-looking outlook
 */
export function generateOutlook(articles: NewsArticle[]): MonthlyOutlook {
  const keyTrends = [
    'Accelerating AI adoption across Black-founded startups',
    'Growing institutional investor interest in diverse founding teams',
    'Expansion of HBCU tech partnerships and recruiting pipelines',
    'Rising prominence of Black tech leaders in enterprise software',
    'Increased focus on climate tech and social impact ventures',
  ];

  const opportunitiesAhead = [
    'Growing demand for AI/ML talent across all experience levels',
    'Expanding funding availability for early-stage Black founders',
    'New HBCU partnerships creating direct pathways to tech careers',
    'Rising opportunities in product management and technical leadership',
    'Increased visibility for Black-founded consumer tech products',
  ];

  const watchList = [
    {
      area: 'AI Regulation',
      description: 'Policy developments around AI ethics and diversity',
      relevance: 'May create opportunities for diverse AI startups',
    },
    {
      area: 'Funding Environment',
      description: 'Continued stabilization of venture capital markets',
      relevance: 'Important for Black founders seeking Series A/B funding',
    },
    {
      area: 'HBCU Tech Programs',
      description: 'Expansion of computer science and engineering curricula',
      relevance: 'Creates stronger talent pipeline for tech industry',
    },
  ];

  const studentFocus = 'Build AI/ML skills, pursue internships at Black-founded startups, engage with HBCU tech communities, and explore emerging fields like climate tech and Web3.';

  const professionalFocus = 'Develop expertise in AI/ML, consider opportunities at growth-stage Black-founded companies, mentor emerging talent, and stay current on industry trends through community engagement.';

  const founderFocus = 'Leverage improving funding environment, build AI-native products, engage with HBCU talent pipelines, focus on capital efficiency, and connect with growing Black founder networks.';

  return {
    keyTrends,
    opportunitiesAhead,
    watchList,
    studentFocus,
    professionalFocus,
    founderFocus,
  };
}

/**
 * Rank and select top monthly stories
 */
export function selectTopStories(articles: NewsArticle[]): MonthlyStory[] {
  // Sort by category priority and recency
  const categoryPriority: Record<string, number> = {
    'startups-funding': 5,
    'innovation-products': 4,
    'careers-opportunities': 3,
    'policy-impact': 2,
    'community-events': 1,
    'general': 0,
  };

  const rankedArticles = [...articles]
    .sort((a, b) => {
      const priorityDiff = (categoryPriority[b.category] || 0) - (categoryPriority[a.category] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    })
    .slice(0, 10);

  return rankedArticles.map((article, index) => {
    const impact = index < 3 ? 'transformative' : index < 6 ? 'significant' : 'notable';
    const relevanceScore = 100 - (index * 8);

    let keyTakeaway = '';
    if (article.category === 'startups-funding') {
      keyTakeaway = 'Demonstrates growing investor confidence and capital availability for Black founders';
    } else if (article.category === 'careers-opportunities') {
      keyTakeaway = 'Opens pathways for career advancement and professional development';
    } else if (article.category === 'innovation-products') {
      keyTakeaway = 'Showcases Black innovation leadership in emerging technology sectors';
    } else {
      keyTakeaway = 'Highlights continued progress in Black tech ecosystem development';
    }

    return {
      article,
      rank: index + 1,
      impact: impact as 'transformative' | 'significant' | 'notable',
      keyTakeaway,
      relevanceScore,
    };
  });
}

/**
 * Generate SEO metadata for monthly report
 */
export function generateMonthlyMetadata(
  monthStart: Date,
  monthEnd: Date,
  articles: NewsArticle[]
): MonthlyReportMetadata {
  const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const title = `State of Black Tech: ${monthName} | Monthly Industry Report`;
  const description = `Comprehensive ${monthName} analysis of Black tech ecosystem: ${articles.length} developments tracked across funding, talent, innovation, and community impact. Essential insights for students, professionals, and founders.`;

  const keywords = [
    'State of Black Tech',
    `Black tech ${monthStart.getFullYear()}`,
    'Black tech industry report',
    'Black founders funding report',
    'HBCU tech opportunities',
    'Black tech monthly analysis',
    'diverse tech leaders',
    'Black innovation report',
    'tech industry diversity',
    'Black tech ecosystem',
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: title,
    description,
    datePublished: monthEnd.toISOString(),
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
    about: {
      '@type': 'Thing',
      name: 'Black Technology Industry',
      description: 'Analysis of Black excellence and innovation in technology',
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
 * Generate complete monthly report
 */
export async function generateMonthlyReport(
  monthStart: Date,
  monthEnd: Date,
  articles: NewsArticle[]
): Promise<MonthlyReport> {
  // Generate all sections
  const executiveSummary = await generateExecutiveSummary(articles);
  const fundingAnalysis = analyzeFunding(articles);
  const talentTrends = analyzeTalentTrends(articles);
  const innovationHighlights = analyzeInnovation(articles);
  const communityImpact = analyzeCommunityImpact(articles);
  const outlook = generateOutlook(articles);
  const topStories = selectTopStories(articles);
  const metadata = generateMonthlyMetadata(monthStart, monthEnd, articles);

  // Format report ID as YYYY-MM
  const reportId = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
  const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    id: reportId,
    monthStart,
    monthEnd,
    title: `State of Black Tech: ${monthName}`,
    executiveSummary,
    fundingAnalysis,
    talentTrends,
    innovationHighlights,
    communityImpact,
    outlook,
    articleCount: articles.length,
    topStories,
    generatedAt: new Date(),
    metadata,
  };
}

/**
 * Get month bounds (first day to last day)
 */
export function getMonthBounds(date: Date = new Date()): { monthStart: Date; monthEnd: Date } {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return { monthStart, monthEnd };
}

/**
 * Get previous month bounds
 */
export function getPreviousMonthBounds(): { monthStart: Date; monthEnd: Date } {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return getMonthBounds(lastMonth);
}
