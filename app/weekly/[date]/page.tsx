import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db/client';
import { encodeArticleId } from '@/lib/utils';

interface WeeklyPageProps {
  params: Promise<{ date: string }>;
}

interface WeeklySummary {
  id: number;
  week_start: string;
  week_end: string;
  publication_date: string;
  title: string;
  theme: string | null;
  article_ids: string[];
  article_count: number;
  is_published: boolean;
  created_at: string;
  published_at: string | null;
}

interface Article {
  external_id: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  published_at: string;
}

// Generate static params for pre-rendering
export async function generateStaticParams() {
  try {
    const result = await pool.query(`
      SELECT publication_date
      FROM weekly_summaries
      WHERE is_published = true
      ORDER BY publication_date DESC
    `);

    return result.rows.map(row => ({
      date: row.publication_date,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const revalidate = 300; // Revalidate every 5 minutes

// Generate metadata for SEO
export async function generateMetadata({ params }: WeeklyPageProps): Promise<Metadata> {
  try {
    const { date } = await params;
    const summary = await getSummaryForDate(date);

    if (!summary) {
      return {
        title: 'Weekly Digest Not Found | Black Tech News',
        description: 'This weekly digest could not be found.',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const description = summary.theme
      ? summary.theme.substring(0, 160) + '...'
      : `Weekly digest of Black tech news featuring ${summary.article_count} top stories`;

    return {
      title: `${summary.title} | Black Tech News`,
      description,

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
        title: summary.title,
        description,
        url: `https://blacktechnews.cc/weekly/${date}`,
        siteName: 'Black Tech News',
        publishedTime: summary.published_at || summary.created_at,
      },

      twitter: {
        card: 'summary_large_image',
        title: summary.title,
        description,
      },

      alternates: {
        canonical: `https://blacktechnews.cc/weekly/${date}`,
      },
    };
  } catch (error) {
    console.error('[Weekly Page] Error generating metadata:', error);
    return {
      title: 'Black Tech News Weekly',
      description: 'Weekly digest of Black tech news',
    };
  }
}

// Get summary for a specific date
async function getSummaryForDate(dateStr: string): Promise<WeeklySummary | null> {
  try {
    const result = await pool.query(`
      SELECT
        id, week_start, week_end, publication_date, title, theme,
        article_ids, article_count, is_published, created_at, published_at
      FROM weekly_summaries
      WHERE publication_date = $1 AND is_published = true
    `, [dateStr]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('[Weekly Page] Error fetching summary:', error);
    return null;
  }
}

// Fetch articles by external IDs
async function getArticlesByIds(externalIds: string[]): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app';
    const response = await fetch(`${apiUrl}/api/articles/list?limit=100`);

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data = await response.json();
    const allArticles = data.articles || [];

    // Filter to only the articles in our summary
    const articles = allArticles.filter((article: any) =>
      externalIds.includes(article.external_id)
    );

    // Sort by the order in externalIds
    return articles.sort((a: any, b: any) => {
      return externalIds.indexOf(a.external_id) - externalIds.indexOf(b.external_id);
    });
  } catch (error) {
    console.error('[Weekly Page] Error fetching articles:', error);
    return [];
  }
}

export default async function WeeklyDigestPage({ params }: WeeklyPageProps) {
  const { date } = await params;
  const summary = await getSummaryForDate(date);

  if (!summary) {
    notFound();
  }

  const articles = await getArticlesByIds(summary.article_ids);

  const weekStart = new Date(summary.week_start);
  const weekEnd = new Date(summary.week_end);
  const weekRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

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
              <p className="text-sm text-gray-400 uppercase tracking-wide">Weekly Digest</p>
              <p className="text-xs text-gray-500">
                {weekRange}
              </p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{summary.title}</h1>
          <p className="text-gray-300 text-lg">
            Your weekly dose of Black excellence in technology, startups, and digital innovation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Theme Section */}
        {summary.theme && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="w-1 h-8 bg-red-600 mr-4"></span>
              This Week's Theme
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {summary.theme.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Top Stories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Top Stories This Week
          </h2>

          <div className="space-y-8">
            {articles.map((article, index) => (
              <article key={article.external_id} className="border-l-4 border-gray-200 pl-6 hover:border-red-600 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 flex-1">
                    <Link
                      href={`/article/${encodeArticleId(article.external_id)}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {index + 1}. {article.title}
                    </Link>
                  </h3>
                </div>

                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="font-semibold text-red-600 mr-2">Category:</span>
                    <span className="capitalize">{article.category.replace('-', ' ')}</span>
                  </p>

                  {article.excerpt && (
                    <p className="text-gray-600">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <Link
                    href={`/article/${encodeArticleId(article.external_id)}`}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Read full story →
                  </Link>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 text-sm"
                  >
                    View source ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed Every Week</h2>
          <p className="text-gray-700 mb-6">
            Get the latest Black tech news, startup funding, career opportunities, and industry trends.
            New digests published every Monday morning.
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
