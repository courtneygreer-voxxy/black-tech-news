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
  // Always generate this month's report ID
  // The page itself will show "generating" state before the 28th
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
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-12 bg-red-600"></div>
              <div className="w-2 h-12 bg-white"></div>
              <div className="w-2 h-12 bg-green-600"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Monthly Report</p>
              <p className="text-xs text-gray-500">
                {report.articleCount} Articles Analyzed
              </p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{report.title}</h1>
          <p className="text-gray-300 text-lg">
            Your monthly pulse on Black tech industry success and innovation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Executive Summary */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Industry Pulse
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg">
              {report.executiveSummary.split('\n\n')[0]}
            </p>
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
            New monthly reports published on the first Monday of each month.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            View Latest News
          </Link>
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
