import { Metadata } from 'next';
import Link from 'next/link';
import pool from '@/lib/db/client';

export const metadata: Metadata = {
  title: 'Weekly Digests - Black Tech News',
  description: 'Browse all weekly digests of Black tech news, featuring top stories, funding rounds, career opportunities, and industry trends for students and professionals.',
  keywords: ['Black tech weekly digest', 'tech news archive', 'HBCU tech resources', 'Black founders news', 'tech career opportunities'],
  openGraph: {
    title: 'Black Tech News Weekly Digests',
    description: 'Weekly summaries of the most important Black tech news',
    type: 'website',
  },
};

export const revalidate = 300; // Revalidate every 5 minutes

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

export default async function WeeklyArchivePage() {
  const summaries = await getPublishedSummaries();
  const latestSummary = summaries[0];
  const pastSummaries = summaries.slice(1);

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
              <p className="text-sm text-gray-400 uppercase tracking-wide">Archive</p>
              <p className="text-xs text-gray-500">Weekly Digests</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Weekly Digests</h1>
          <p className="text-gray-300 text-lg">
            Your weekly dose of Black excellence in technology, startups, and digital innovation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {latestSummary ? (
          <>
            {/* Current Week */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="w-1 h-8 bg-red-600 mr-4"></span>
                Latest Digest
              </h2>

              <Link
                href={`/weekly/${latestSummary.publication_date}`}
                className="block border-2 border-gray-200 rounded-lg p-8 hover:border-red-600 transition-all hover:shadow-lg"
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
                  Read this week's digest
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </section>

            {/* Past Digests */}
            {pastSummaries.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center">
                  <span className="w-1 h-8 bg-red-600 mr-4"></span>
                  Past Digests
                </h2>

                <div className="space-y-6">
                  {pastSummaries.map((summary) => (
                    <Link
                      key={summary.id}
                      href={`/weekly/${summary.publication_date}`}
                      className="block border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {summary.title}
                          </h3>
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
              </section>
            )}
          </>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-3">No Digests Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Weekly digests will appear here once they're published. Check back soon for the latest Black tech news summaries.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <section className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Weekly Updates</h2>
          <p className="text-gray-700 mb-6">
            New digests published every Monday morning at 6:00 AM EST. Never miss the latest
            Black tech news, startup funding, and career opportunities.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            View Latest News
          </Link>
        </section>
      </div>
    </main>
  );
}
