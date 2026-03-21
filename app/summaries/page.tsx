import { Metadata } from 'next';
import Link from 'next/link';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';
import pool from '@/lib/db/client';

export const metadata: Metadata = {
  title: 'Summaries - Black Tech News',
  description: 'Weekly digests curating the most important Black tech news stories, trends, and insights.',
  keywords: ['Black tech weekly digest', 'tech news summary', 'HBCU tech news', 'Black founders news'],
  openGraph: {
    title: 'Black Tech News Summaries',
    description: 'Curated weekly summaries of Black tech news',
    type: 'website',
  },
};

export const revalidate = 300;

interface WeeklySummary {
  id: number;
  week_start: string;
  week_end: string;
  publication_date: string;
  title: string;
  theme: string | null;
  article_count: number;
  is_published: boolean;
  created_at: string;
  published_at: string | null;
}

async function getPublishedSummaries(): Promise<WeeklySummary[]> {
  try {
    const result = await pool.query(`
      SELECT
        id, week_start, week_end, publication_date, title, theme,
        article_count, is_published, created_at, published_at
      FROM weekly_summaries
      WHERE is_published = true
      ORDER BY publication_date DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching weekly summaries:', error);
    return [];
  }
}

export default async function SummariesPage() {
  const summaries = await getPublishedSummaries();
  const latestSummary = summaries[0];
  const pastSummaries = summaries.slice(1);

  return (
    <>
      <BTNNavbar />

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
              <h1 className="text-5xl font-bold">Summaries</h1>
            </div>
            <p className="text-gray-300 text-xl max-w-2xl">
              Curated insights and analysis of Black tech news, delivered weekly
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Weekly Summaries Section */}
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-10 bg-red-600 mr-4"></span>
                Weekly Digests
              </h2>
              <p className="text-gray-600 text-lg">
                Every Monday, we curate the top Black tech stories from the past week with AI-powered insights
              </p>
            </div>

            {latestSummary ? (
              <>
                {/* Latest Digest */}
                <Link
                  href={`/weekly/${latestSummary.publication_date}`}
                  className="block border-2 border-gray-200 rounded-xl p-8 hover:border-red-600 transition-all hover:shadow-lg mb-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {latestSummary.title}
                      </h3>
                      <p className="text-gray-600">
                        Published {new Date(latestSummary.publication_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm">
                      LATEST
                    </span>
                  </div>
                  {latestSummary.theme && (
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {latestSummary.theme}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mb-4">
                    {latestSummary.article_count} articles featured
                  </p>
                  <span className="text-red-600 font-medium inline-flex items-center">
                    Read this week&apos;s digest
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>

                {/* Past Digests */}
                {pastSummaries.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Past Digests</h3>
                    {pastSummaries.map((summary) => (
                      <Link
                        key={summary.id}
                        href={`/weekly/${summary.publication_date}`}
                        className="block border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {summary.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(summary.publication_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        {summary.theme && (
                          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                            {summary.theme}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {summary.article_count} articles
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="max-w-xl mx-auto">
                  <div className="text-5xl mb-6">📰</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Digests Yet</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Weekly digests will appear here once they&apos;re published. Check back soon for curated Black tech news summaries featuring top stories and AI-powered insights.
                  </p>
                  <p className="text-sm text-gray-500">
                    New digests published every Monday at 6:00 AM EST
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Call to Action */}
          <section className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss a Summary</h2>
            <p className="text-gray-700 mb-6">
              Get notified when our weekly digests are published
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Subscribe to Newsletter
            </Link>
          </section>
        </div>
      </main>

      <BTNFooter />
    </>
  );
}
