import { Metadata } from 'next';
import BTNNavbar from '@/components/BTNNavbar';
import BTNFooter from '@/components/BTNFooter';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Black Tech News',
  description: 'Terms and Conditions for using the Black Tech News website.',
  robots: {
    index: false, // No-index legal pages
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <BTNNavbar />
      <main className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
        <h1 className="text-3xl font-bold text-black mb-6">
          Terms and Conditions
        </h1>
        <div className="prose lg:prose-xl text-gray-700 space-y-4">
          <p>
            Welcome to Black Tech News. If you continue to browse and use this
            website, you are agreeing to comply with and be bound by the
            following terms and conditions of use, which together with our
            privacy policy govern Black Tech News's relationship with you in
            relation to this website.
          </p>
          <h2 className="text-2xl font-bold text-black mt-6">
            Placeholder Section
          </h2>
          <p>
            This is placeholder text. You must replace this with your own
            official Terms and Conditions. This document should detail the rules
            and guidelines for the use of your website.
          </p>
          <p>
            Key sections to include are:
          </p>
          <ul>
            <li>Introduction</li>
            <li>Intellectual Property Rights</li>
            <li>Restrictions</li>
            <li>Your Content</li>
            <li>No warranties</li>
            <li>Limitation of liability</li>
            <li>Indemnification</li>
            <li>Severability</li>
            <li>Variation of Terms</li>
            <li>Governing Law & Jurisdiction</li>
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
