import { Metadata } from 'next';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | Black Tech News',
  description: 'Privacy Policy for the Black Tech News website.',
  robots: {
    index: false, // No-index legal pages
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <BTNNavbar />
      <main className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
        <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
        <div className="prose lg:prose-xl text-gray-700 space-y-4">
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>

          <h2 className="text-2xl font-bold text-black mt-6">
            Information Collection and Use
          </h2>
          <p>
            This is placeholder text. You must replace this with your own
            official Privacy Policy. This policy is required by law and by
            services like Google AdSense. It must inform users about the data you
            collect, how you use it, and how you protect it.
          </p>
          <p>
            Key sections to include are:
          </p>
          <ul>
            <li>What information is collected (e.g., personal data, usage data).</li>
            <li>How tracking technologies like cookies are used.</li>
            <li>How third-party vendors, including Google, use cookies to serve ads.</li>
            <li>Information on how users can opt out of personalized advertising.</li>
            <li>Contact Information.</li>
          </ul>
           <p>
            Last Updated: December 23, 2025
          </p>
        </div>
      </main>
      <BTNFooter />
    </div>
  );
}
