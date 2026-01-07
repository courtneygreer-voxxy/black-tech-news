import { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticlesForBuild } from '@/lib/api/articles';
import { getWeekBounds } from '@/lib/weekly/generator';

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

// Generate list of weekly digests (last 8 weeks)
function generateWeeklyDigestList() {
  const digests = [];
  const today = new Date();

  // Generate last 8 weeks
  for (let i = 0; i < 8; i++) {
    const weekDate = new Date(today);
    weekDate.setDate(today.getDate() - (i * 7));

    const bounds = getWeekBounds(weekDate);
    const monday = new Date(bounds.weekStart);
    monday.setDate(monday.getDate() + 1); // Sunday -> Monday

    const dateStr = monday.toISOString().split('T')[0];
    const startStr = bounds.weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endStr = bounds.weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    digests.push({
      id: dateStr,
      title: `Week of ${startStr} - ${endStr}`,
      date: monday,
      weekStart: bounds.weekStart,
      weekEnd: bounds.weekEnd,
    });
  }

  return digests;
}

export default function WeeklyArchivePage() {
  const digests = generateWeeklyDigestList();
  const currentDigest = digests[0];
  const pastDigests = digests.slice(1);

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
        {/* Current Week */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            This Week
          </h2>

          <Link
            href={`/weekly/${currentDigest.id}`}
            className="block border-2 border-gray-200 rounded-lg p-8 hover:border-red-600 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentDigest.title}
                </h3>
                <p className="text-gray-600">
                  Published {currentDigest.date.toLocaleDateString('en-US', {
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
            <p className="text-gray-700 mb-4">
              This week's top stories in Black tech: funding rounds, career opportunities,
              AI innovations, and founder updates. Essential reading for students, professionals,
              and entrepreneurs.
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
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <span className="w-1 h-8 bg-red-600 mr-4"></span>
            Past Digests
          </h2>

          <div className="space-y-6">
            {pastDigests.map((digest) => (
              <Link
                key={digest.id}
                href={`/weekly/${digest.id}`}
                className="block border border-gray-200 rounded-lg p-6 hover:border-red-600 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {digest.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Published {digest.date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="text-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

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
