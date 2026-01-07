import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticlesForBuild } from '@/lib/api/articles';
import { generateWeeklyDigest, getWeekBounds } from '@/lib/weekly/generator';
import { encodeArticleId } from '@/lib/utils';
import type { WeeklyDigest } from '@/lib/weekly/types';

interface WeeklyPageProps {
  params: Promise<{ date: string }>;
}

// Generate static params for pre-rendering
export async function generateStaticParams() {
  // For now, generate just this week's digest
  // In production, this would generate last 4-8 weeks
  const today = new Date();
  const currentWeek = getWeekBounds(today);
  const monday = new Date(currentWeek.weekStart);
  monday.setDate(monday.getDate() + 1); // Sunday -> Monday

  return [
    { date: monday.toISOString().split('T')[0] },
  ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WeeklyPageProps): Promise<Metadata> {
  try {
    const { date } = await params;
    const digest = await getDigestForDate(date);

    if (!digest) {
      return {
        title: 'Weekly Digest Not Found | Black Tech News',
        description: 'This weekly digest could not be found.',
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    return {
      title: digest.metadata.seoTitle,
      description: digest.metadata.seoDescription,
      keywords: digest.metadata.keywords,

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
        title: digest.metadata.seoTitle,
        description: digest.metadata.seoDescription,
        url: `https://blacktechnews.com/weekly/${date}`,
        siteName: 'Black Tech News',
        publishedTime: digest.generatedAt.toISOString(),
      },

      twitter: {
        card: 'summary_large_image',
        title: digest.metadata.seoTitle,
        description: digest.metadata.seoDescription,
        creator: '@BlackTechNews',
        site: '@BlackTechNews',
      },

      alternates: {
        canonical: `https://blacktechnews.com/weekly/${date}`,
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

// Get digest for a specific date
async function getDigestForDate(dateStr: string): Promise<WeeklyDigest | null> {
  try {
    // Parse date (format: YYYY-MM-DD, should be a Monday)
    const monday = new Date(dateStr);
    if (isNaN(monday.getTime())) {
      return null;
    }

    // Get the Sunday before this Monday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() - 1);
    sunday.setHours(0, 0, 0, 0);

    // Get the Saturday after this Sunday
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    console.log('[Weekly Page] Fetching digest for:', {
      dateStr,
      sunday: sunday.toISOString(),
      saturday: saturday.toISOString(),
    });

    // Fetch articles from the week
    const allArticles = await fetchArticlesForBuild(50);
    const weekArticles = allArticles.filter((article) => {
      const publishedDate = new Date(article.publishedAt);
      return publishedDate >= sunday && publishedDate <= saturday;
    });

    // Use recent articles if none in that specific week
    const articlesToUse = weekArticles.length > 0 ? weekArticles : allArticles.slice(0, 15);

    // Generate digest
    const digest = await generateWeeklyDigest(sunday, saturday, articlesToUse);

    return digest;
  } catch (error) {
    console.error('[Weekly Page] Error fetching digest:', error);
    return null;
  }
}

export default async function WeeklyDigestPage({ params }: WeeklyPageProps) {
  const { date } = await params;
  const digest = await getDigestForDate(date);

  if (!digest) {
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
              <p className="text-sm text-gray-400 uppercase tracking-wide">Weekly Digest</p>
              <p className="text-xs text-gray-500">
                {digest.articleCount} Stories • {digest.trendingTopics.length} Topics
              </p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{digest.title}</h1>
          <p className="text-gray-300 text-lg">
            Your weekly dose of Black excellence in technology, startups, and digital innovation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Theme Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            This Week's Theme
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {digest.theme.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Top Stories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Top Stories This Week
          </h2>

          <div className="space-y-8">
            {digest.topStories.map((story) => (
              <article key={story.article.id} className="border-l-4 border-gray-200 pl-6 hover:border-red-600 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 flex-1">
                    <Link
                      href={`/article/${encodeArticleId(story.article.id)}`}
                      className="hover:text-red-600 transition-colors"
                    >
                      {story.rank}. {story.article.title}
                    </Link>
                  </h3>
                </div>

                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="font-semibold text-red-600 mr-2">Category:</span>
                    <span className="capitalize">{story.article.category.replace('-', ' ')}</span>
                  </p>

                  <p className="flex items-start">
                    <span className="font-semibold text-red-600 mr-2">Key Insight:</span>
                    <span>{story.keyInsight}</span>
                  </p>

                  <p className="flex items-start">
                    <span className="font-semibold text-red-600 mr-2">Why It Matters:</span>
                    <span>{story.whyItMatters}</span>
                  </p>
                </div>

                <Link
                  href={`/article/${encodeArticleId(story.article.id)}`}
                  className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  Read full story →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Trending Topics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Trending Topics
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {digest.trendingTopics.map((topic) => (
              <div key={topic.name} className="border border-gray-200 rounded-lg p-6 hover:border-red-600 transition-colors">
                <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                <p className="text-gray-600 mb-4">{topic.articleCount} articles</p>
                <div className="flex flex-wrap gap-2">
                  {topic.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed Every Week</h2>
          <p className="text-gray-700 mb-6">
            Get the latest Black tech news, startup funding, career opportunities, and industry trends
            delivered to your inbox every Monday morning.
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
          __html: JSON.stringify(digest.metadata.structuredData),
        }}
      />
    </main>
  );
}
