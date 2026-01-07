import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticlesForBuild } from '@/lib/api/articles';
import { generateMonthlyReport, getMonthBounds } from '@/lib/monthly/generator';
import { encodeArticleId } from '@/lib/utils';
import type { MonthlyReport } from '@/lib/monthly/types';

interface MonthlyPageProps {
  params: Promise<{ date: string }>;
}

// Generate static params for pre-rendering
export async function generateStaticParams() {
  // For now, generate just this month's report
  // In production, this would generate last 6-12 months
  const today = new Date();
  const reportId = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  return [
    { date: reportId }, // e.g., "2026-01"
  ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: MonthlyPageProps): Promise<Metadata> {
  try {
    const { date } = await params;
    const report = await getReportForDate(date);

    if (!report) {
      return {
        title: 'Monthly Report Not Found | Black Tech News',
        description: 'This monthly report could not be found.',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    return {
      title: report.metadata.seoTitle,
      description: report.metadata.seoDescription,
      keywords: report.metadata.keywords,

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

      openGraph: {
        type: 'article',
        title: report.metadata.seoTitle,
        description: report.metadata.seoDescription,
        url: `https://blacktechnews.com/monthly/${date}`,
        siteName: 'Black Tech News',
        publishedTime: report.generatedAt.toISOString(),
      },

      twitter: {
        card: 'summary_large_image',
        title: report.metadata.seoTitle,
        description: report.metadata.seoDescription,
        creator: '@BlackTechNews',
        site: '@BlackTechNews',
      },

      alternates: {
        canonical: `https://blacktechnews.com/monthly/${date}`,
      },
    };
  } catch (error) {
    console.error('[Monthly Page] Error generating metadata:', error);
    return {
      title: 'State of Black Tech Monthly Report',
      description: 'Comprehensive monthly analysis of the Black tech ecosystem',
    };
  }
}

// Get report for a specific month
async function getReportForDate(dateStr: string): Promise<MonthlyReport | null> {
  try {
    // Parse date (format: YYYY-MM)
    const [year, month] = dateStr.split('-').map(Number);
    if (!year || !month || month < 1 || month > 12) {
      return null;
    }

    const reportDate = new Date(year, month - 1, 1);
    const bounds = getMonthBounds(reportDate);

    console.log('[Monthly Page] Fetching report for:', {
      dateStr,
      monthStart: bounds.monthStart.toISOString(),
      monthEnd: bounds.monthEnd.toISOString(),
    });

    // Fetch articles from the month
    const allArticles = await fetchArticlesForBuild(100);
    const monthArticles = allArticles.filter((article) => {
      const publishedDate = new Date(article.publishedAt);
      return publishedDate >= bounds.monthStart && publishedDate <= bounds.monthEnd;
    });

    // Use recent articles if none in that specific month
    const articlesToUse = monthArticles.length > 0 ? monthArticles : allArticles.slice(0, 30);

    // Generate report
    const report = await generateMonthlyReport(bounds.monthStart, bounds.monthEnd, articlesToUse);

    return report;
  } catch (error) {
    console.error('[Monthly Page] Error fetching report:', error);
    return null;
  }
}

export default async function MonthlyReportPage({ params }: MonthlyPageProps) {
  const { date } = await params;
  const report = await getReportForDate(date);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 border-b-4 border-red-600">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-12 bg-red-600"></div>
              <div className="w-2 h-12 bg-white"></div>
              <div className="w-2 h-12 bg-green-600"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Monthly Report</p>
              <p className="text-xs text-gray-500">
                {report.articleCount} Articles Analyzed • 5 Key Sections
              </p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{report.title}</h1>
          <p className="text-gray-300 text-lg">
            Comprehensive analysis of funding, talent, innovation, community impact, and outlook
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="#executive-summary" className="text-red-600 hover:text-red-700 font-medium">Executive Summary</a>
            <span className="text-gray-300">|</span>
            <a href="#funding" className="text-red-600 hover:text-red-700 font-medium">Funding Analysis</a>
            <span className="text-gray-300">|</span>
            <a href="#talent" className="text-red-600 hover:text-red-700 font-medium">Talent Trends</a>
            <span className="text-gray-300">|</span>
            <a href="#innovation" className="text-red-600 hover:text-red-700 font-medium">Innovation</a>
            <span className="text-gray-300">|</span>
            <a href="#community" className="text-red-600 hover:text-red-700 font-medium">Community Impact</a>
            <span className="text-gray-300">|</span>
            <a href="#outlook" className="text-red-600 hover:text-red-700 font-medium">Outlook</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Executive Summary */}
        <section id="executive-summary" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Executive Summary
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {report.executiveSummary.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Funding Analysis */}
        <section id="funding" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Funding Analysis
          </h2>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.fundingAnalysis.totalDeals}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Total Deals</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.fundingAnalysis.fundingStages.seed}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Seed Stage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.fundingAnalysis.fundingStages.seriesA}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Series A</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.fundingAnalysis.fundingStages.seriesB + report.fundingAnalysis.fundingStages.seriesCPlus}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Series B+</div>
            </div>
          </div>

          {/* Top Sectors */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Top Sectors</h3>
            <div className="space-y-3">
              {report.fundingAnalysis.topSectors.map((sector) => (
                <div key={sector.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{sector.name}</span>
                      <span className="text-sm text-gray-600">{sector.dealCount} deals ({sector.percentage}%)</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${sector.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Deals */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Notable Deals</h3>
            <div className="space-y-4">
              {report.fundingAnalysis.notableDeals.map((deal, i) => (
                <div key={i} className="border-l-4 border-gray-200 pl-4 hover:border-red-600 transition-colors">
                  <div className="font-bold text-lg">{deal.company}</div>
                  <div className="text-gray-600">{deal.sector}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {report.fundingAnalysis.insights.map((insight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Talent Trends */}
        <section id="talent" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Talent & Career Trends
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Top Roles */}
            <div>
              <h3 className="text-xl font-bold mb-4">Top Roles in Demand</h3>
              <div className="space-y-4">
                {report.talentTrends.topRoles.map((role) => (
                  <div key={role.title} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-bold">{role.title}</div>
                    <div className="text-sm text-gray-600">{role.count} opportunities</div>
                    {role.avgSalaryRange && (
                      <div className="text-sm text-red-600 font-medium mt-1">{role.avgSalaryRange}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Skills */}
            <div>
              <h3 className="text-xl font-bold mb-4">Emerging Skills</h3>
              <div className="flex flex-wrap gap-2">
                {report.talentTrends.emergingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4 mt-8">Top Hiring Companies</h3>
              <div className="space-y-3">
                {report.talentTrends.topCompanies.map((company) => (
                  <div key={company.name} className="border-l-4 border-gray-200 pl-4">
                    <div className="font-bold">{company.name}</div>
                    <div className="text-sm text-gray-600">{company.openings} openings • {company.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {report.talentTrends.insights.map((insight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Innovation Highlights */}
        <section id="innovation" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Innovation Highlights
          </h2>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.innovationHighlights.productLaunches}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Product Launches</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.innovationHighlights.aiMlDevelopments}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">AI/ML Developments</div>
            </div>
          </div>

          {/* Tech Breakthroughs */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Technology Breakthroughs</h3>
            <div className="space-y-6">
              {report.innovationHighlights.techBreakthroughs.map((breakthrough, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg flex-1">{breakthrough.title}</h4>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full ml-4">
                      {breakthrough.category}
                    </span>
                  </div>
                  <p className="text-gray-700">{breakthrough.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emerging Trends */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Emerging Trends</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {report.innovationHighlights.emergingTrends.map((trend) => (
                <div key={trend} className="border-l-4 border-red-600 pl-4 py-2">
                  {trend}
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {report.innovationHighlights.insights.map((insight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Community Impact */}
        <section id="community" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Community Impact
          </h2>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.communityImpact.eventsHosted}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Events Hosted</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{report.communityImpact.partnershipsFormed}</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">Partnerships Formed</div>
            </div>
          </div>

          {/* Educational Initiatives */}
          {report.communityImpact.educationalInitiatives.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Educational Initiatives</h3>
              <div className="space-y-4">
                {report.communityImpact.educationalInitiatives.map((initiative, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-bold">{initiative.name}</div>
                    <div className="text-sm text-gray-600">{initiative.type}</div>
                    {initiative.reach && (
                      <div className="text-sm text-red-600 font-medium mt-1">{initiative.reach}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HBCU Highlights */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">HBCU Highlights</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {report.communityImpact.hbcuHighlights.map((highlight, i) => (
                <div key={i} className="border-l-4 border-green-600 pl-4 py-2">
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {report.communityImpact.insights.map((insight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Outlook */}
        <section id="outlook" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Forward-Looking Outlook
          </h2>

          {/* Key Trends */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Key Trends to Watch</h3>
            <ul className="space-y-2">
              {report.outlook.keyTrends.map((trend, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">{i + 1}.</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Opportunities Ahead</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {report.outlook.opportunitiesAhead.map((opportunity, i) => (
                <div key={i} className="border-l-4 border-green-600 pl-4 py-2">
                  {opportunity}
                </div>
              ))}
            </div>
          </div>

          {/* Watch List */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Watch List</h3>
            <div className="space-y-4">
              {report.outlook.watchList.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <div className="font-bold text-lg mb-2">{item.area}</div>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <p className="text-sm text-red-600 font-medium">Relevance: {item.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audience-Specific Focus */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h4 className="font-bold mb-2 flex items-center">
                <span className="text-2xl mr-2">🎓</span>
                For Students
              </h4>
              <p className="text-sm text-gray-700">{report.outlook.studentFocus}</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
              <h4 className="font-bold mb-2 flex items-center">
                <span className="text-2xl mr-2">💼</span>
                For Professionals
              </h4>
              <p className="text-sm text-gray-700">{report.outlook.professionalFocus}</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
              <h4 className="font-bold mb-2 flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                For Founders
              </h4>
              <p className="text-sm text-gray-700">{report.outlook.founderFocus}</p>
            </div>
          </div>
        </section>

        {/* Top Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Top 10 Stories This Month
          </h2>

          <div className="space-y-6">
            {report.topStories.map((story) => (
              <article key={story.article.id} className="border border-gray-200 rounded-lg p-6 hover:border-red-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-3xl font-bold text-red-600 mr-4">#{story.rank}</span>
                      <h3 className="text-xl font-bold flex-1">
                        <Link
                          href={`/article/${encodeArticleId(story.article.id)}`}
                          className="hover:text-red-600 transition-colors"
                        >
                          {story.article.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="capitalize">{story.article.category.replace('-', ' ')}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        story.impact === 'transformative' ? 'text-red-600' :
                        story.impact === 'significant' ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {story.impact.charAt(0).toUpperCase() + story.impact.slice(1)} Impact
                      </span>
                      <span>•</span>
                      <span>Relevance: {story.relevanceScore}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{story.keyTakeaway}</p>

                <Link
                  href={`/article/${encodeArticleId(story.article.id)}`}
                  className="inline-block text-red-600 hover:text-red-700 font-medium"
                >
                  Read full story →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
          <p className="text-gray-700 mb-6">
            New monthly reports published on the first Monday of each month. Weekly digests available every Monday at 6:00 AM EST.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/weekly"
              className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              View Weekly Digests
            </Link>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Latest News
            </Link>
          </div>
        </section>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(report.metadata.structuredData),
        }}
      />
    </main>
  );
}
