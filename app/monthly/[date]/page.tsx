import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db/client';
import { encodeArticleId } from '@/lib/utils';

interface MonthlyPageProps {
  params: Promise<{ date: string }>;
}

interface MonthlySummary {
  id: number;
  month_start: string;
  month_end: string;
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
      FROM monthly_summaries
      WHERE is_published = true
      ORDER BY publication_date DESC
    `);

    return result.rows.map(row => ({
      date: row.publication_date.substring(0, 7), // YYYY-MM format
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const revalidate = 300; // Revalidate every 5 minutes

// Generate metadata for SEO
export async function generateMetadata({ params }: MonthlyPageProps): Promise<Metadata> {
  try {
    const { date } = await params;
    const summary = await getSummaryForDate(date);

    if (!summary) {
      return {
        title: 'Monthly Report Not Found | Black Tech News',
        description: 'This monthly report could not be found.',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const description = summary.theme
      ? summary.theme.substring(0, 160) + '...'
      : `State of Black Tech monthly report featuring ${summary.article_count} top stories`;

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
        url: `https://blacktechnews.cc/monthly/${date}`,
        siteName: 'Black Tech News',
        publishedTime: summary.published_at || summary.created_at,
      },

      twitter: {
        card: 'summary_large_image',
        title: summary.title,
        description,
      },

      alternates: {
        canonical: `https://blacktechnews.cc/monthly/${date}`,
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

// Get summary for a specific month (YYYY-MM format)
async function getSummaryForDate(dateStr: string): Promise<MonthlySummary | null> {
  try {
    const result = await pool.query(`
      SELECT
        id, month_start, month_end, publication_date, title, theme,
        article_ids, article_count, is_published, created_at, published_at
      FROM monthly_summaries
      WHERE publication_date LIKE $1 AND is_published = true
    `, [dateStr + '%']);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('[Monthly Page] Error fetching summary:', error);
    return null;
  }
}

// Fetch articles by external IDs
async function getArticlesByIds(externalIds: string[]): Promise<Article[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app';
    const response = await fetch(`${apiUrl}/api/articles/list?limit=200`);

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
    console.error('[Monthly Page] Error fetching articles:', error);
    return [];
  }
}

export default async function MonthlyReportPage({ params }: MonthlyPageProps) {
  const { date } = await params;
  const summary = await getSummaryForDate(date);

  if (!summary) {
    notFound();
  }

  const articles = await getArticlesByIds(summary.article_ids);

  const monthStart = new Date(summary.month_start);
  const monthName = monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
              <p className="text-sm text-gray-400 uppercase tracking-wide">Monthly Report</p>
              <p className="text-xs text-gray-500">State of Black Tech</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{summary.title}</h1>
          <p className="text-gray-300 text-xl">
            Comprehensive monthly analysis of the Black tech ecosystem
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Executive Summary Section */}
        {summary.theme && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="w-1 h-8 bg-red-600 mr-4"></span>
              Executive Summary
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
            Top Stories from {monthName}
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

        {/* Navigation */}
        <section className="bg-gray-50 rounded-lg p-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/monthly"
              className="inline-block px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors"
            >
              ← All Monthly Reports
            </Link>
            <Link
              href="/weekly"
              className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              View Weekly Digests
            </Link>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Latest News
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
