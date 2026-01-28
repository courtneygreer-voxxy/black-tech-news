import { Metadata } from 'next';
import Link from 'next/link';
import pool from '@/lib/db/client';

export const metadata: Metadata = {
  title: 'State of Black Tech Monthly Reports - Black Tech News',
  description: 'Browse comprehensive monthly reports analyzing the Black tech ecosystem: funding trends, talent insights, innovation highlights, and community impact. Essential reading for students, professionals, and founders.',
  keywords: ['State of Black Tech', 'Black tech monthly report', 'tech industry analysis', 'Black founders report', 'HBCU tech insights', 'tech diversity report'],
  openGraph: {
    title: 'State of Black Tech Monthly Reports',
    description: 'Comprehensive monthly analysis of the Black tech ecosystem',
    type: 'website',
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

interface MonthlySummary {
  id: number;
  month_start: string;
  month_end: string;
  publication_date: string;
  title: string;
  theme: string | null;
  article_count: number;
  is_published: boolean;
  created_at: string;
  published_at: string | null;
}

async function getPublishedSummaries(): Promise<MonthlySummary[]> {
  try {
    const result = await pool.query(`
      SELECT
        id, month_start, month_end, publication_date, title, theme,
        article_count, is_published, created_at, published_at
      FROM monthly_summaries
      WHERE is_published = true
      ORDER BY publication_date DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching monthly summaries:', error);
    return [];
  }
}

export default async function MonthlyArchivePage() {
  const summaries = await getPublishedSummaries();
  const latestSummary = summaries[0];
  const pastSummaries = summaries.slice(1);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 border-b-4 border-red-600">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex space-x-1">
              <div className="w-2 h-16 bg-red-600"></div>
              <div className="w-2 h-16 bg-white"></div>
              <div className="w-2 h-16 bg-green-600"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">Monthly Reports</p>
              <p className="text-xs text-gray-500">State of Black Tech</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">State of Black Tech</h1>
          <p className="text-gray-300 text-xl mb-4">
            Comprehensive monthly analysis of the Black tech ecosystem
          </p>
          <p className="text-gray-400">
            Tracking funding trends, talent insights, innovation highlights, community impact, and forward-looking outlook.
            Published on the first Monday of every month.
          </p>
        </div>
      </div>

      {/* What's Inside Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">What's Inside Each Report</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-red-600">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-2">Data & Analysis</h3>
              <p className="text-sm text-gray-700">Funding trends, deal flow, sector analysis, and talent insights</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-green-600">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold mb-2">Innovation Tracking</h3>
              <p className="text-sm text-gray-700">Product launches, tech breakthroughs, and emerging trends</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">Actionable Insights</h3>
              <p className="text-sm text-gray-700">Tailored guidance for students, professionals, and founders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {latestSummary ? (
          <>
            {/* Latest Report */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="w-1 h-8 bg-red-600 mr-4"></span>
                Latest Report
              </h2>

              <Link
                href={`/monthly/${latestSummary.publication_date.substring(0, 7)}`}
                className="block border-2 border-gray-200 rounded-lg p-8 hover:border-red-600 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {latestSummary.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Published {new Date(latestSummary.publication_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="px-5 py-2 bg-red-600 text-white font-bold rounded-lg text-sm ml-4">
                    LATEST
                  </span>
                </div>
                {latestSummary.theme && (
                  <p className="text-gray-700 mb-6 leading-relaxed line-clamp-4">
                    {latestSummary.theme}
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-4">
                  {latestSummary.article_count} articles featured
                </p>
                <span className="text-red-600 font-medium inline-flex items-center text-lg">
                  Read this month's report
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </section>

            {/* Past Reports */}
            {pastSummaries.length > 0 && (
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 flex items-center">
                  <span className="w-1 h-8 bg-red-600 mr-4"></span>
                  Past Reports
                </h2>

                <div className="space-y-6">
                  {pastSummaries.map((summary) => (
                    <Link
                      key={summary.id}
                      href={`/monthly/${summary.publication_date.substring(0, 7)}`}
                      className="block border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {summary.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(summary.publication_date).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {summary.theme && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                          {summary.theme}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {summary.article_count} articles
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              <span className="w-1 h-8 bg-red-600 mr-4"></span>
              Latest Report
            </h2>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">No Reports Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Monthly reports will appear here once they're published. Check back soon for comprehensive State of Black Tech analysis.
              </p>
            </div>
          </section>
        )}

        {/* Who Should Read */}
        <section className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">Who Should Read These Reports?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🎓</div>
              <h3 className="font-bold mb-2">Students</h3>
              <p className="text-sm text-gray-700">
                Understand industry trends, identify career paths, discover internship opportunities, and learn from successful Black tech leaders
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">💼</div>
              <h3 className="font-bold mb-2">Professionals</h3>
              <p className="text-sm text-gray-700">
                Track market dynamics, identify growth opportunities, stay current on emerging skills, and connect with the Black tech community
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🚀</div>
              <h3 className="font-bold mb-2">Founders</h3>
              <p className="text-sm text-gray-700">
                Analyze funding trends, benchmark against peers, identify market opportunities, and understand investor sentiment
              </p>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Looking for More Frequent Updates?</h2>
          <p className="text-gray-700 mb-6">
            Our weekly digests provide timely summaries of top Black tech stories, published every Monday at 6:00 AM EST.
            Perfect for staying current between monthly reports.
          </p>
          <div className="flex flex-wrap gap-4">
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
    </main>
  );
}
