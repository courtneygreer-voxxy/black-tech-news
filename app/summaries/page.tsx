import { Metadata } from 'next';
import Link from 'next/link';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';

export const metadata: Metadata = {
  title: 'Summaries - Black Tech News',
  description: 'Weekly digests and monthly reports curating the most important Black tech news stories, trends, and insights.',
  keywords: ['Black tech weekly digest', 'Black tech monthly report', 'tech news summary', 'HBCU tech news', 'Black founders news'],
  openGraph: {
    title: 'Black Tech News Summaries',
    description: 'Curated weekly and monthly summaries of Black tech news',
    type: 'website',
  },
};

export default function SummariesPage() {
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
              Curated insights and analysis of Black tech news, delivered weekly and monthly
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

            {/* Coming Soon Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="max-w-xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 flex space-x-2">
                      <div className="flex-1 bg-red-600 rounded-lg opacity-30"></div>
                      <div className="flex-1 bg-black rounded-lg opacity-30"></div>
                      <div className="flex-1 bg-green-600 rounded-lg opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Starting next week, you'll find our weekly digests here featuring:
                </p>

                <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Top 10 Stories</span> from the past week
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">AI-Generated Themes</span> identifying trends and patterns
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Insightful Analysis</span> on why these stories matter
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  First digest drops Monday, February 3, 2026
                </p>
              </div>
            </div>
          </section>

          {/* Monthly Reports Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-10 bg-red-600 mr-4"></span>
                Monthly Reports
              </h2>
              <p className="text-gray-600 text-lg">
                Executive-style "State of Black Tech" reports published on the first Monday of each month
              </p>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="max-w-xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 flex space-x-2">
                      <div className="flex-1 bg-red-600 rounded-lg opacity-30"></div>
                      <div className="flex-1 bg-black rounded-lg opacity-30"></div>
                      <div className="flex-1 bg-green-600 rounded-lg opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our first monthly report will be published in February, featuring:
                </p>

                <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Top 10 Stories</span> from the entire month
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Strategic Insights</span> about the Black tech ecosystem
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Big Picture Analysis</span> of breakthrough achievements
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <span className="font-semibold">Industry Trends</span> shaping Black innovation
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  First report drops Monday, March 3, 2026
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss a Summary</h2>
            <p className="text-gray-700 mb-6">
              Get notified when our weekly digests and monthly reports are published
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
