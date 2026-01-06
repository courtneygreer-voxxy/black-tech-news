import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import CookieConsentBanner from '@/components/CookieConsentBanner';

export const metadata: Metadata = {
  title: 'Black Tech News | Breaking News for Black Tech Professionals & Startups',
  description:
    'Stay updated with the latest Black tech news, diversity in tech stories, Black founders, startups, and innovation. Daily curated news from trusted sources.',
  keywords: [
    'black tech news',
    'black tech professionals',
    'black entrepreneurs',
    'black startups',
    'black founders',
    'diversity in tech',
    'afrotech news',
    'black innovation',
    'black technology leaders',
    'tech diversity news',
    'black enterprise tech',
    'people of color in tech',
    'HBCU technology',
    'black tech community',
  ],
  authors: [{ name: 'Black Tech News' }],
  creator: 'Black Tech News',
  publisher: 'Black Tech News',
  metadataBase: new URL('https://blacktechnews.cc'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Black Tech News | Breaking News for Black Tech Professionals',
    description:
      'Daily curated tech news highlighting Black innovation, startups, and diversity in technology. Stay informed about Black tech leaders shaping the future.',
    url: 'https://blacktechnews.cc',
    siteName: 'Black Tech News',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Black Tech News - Technology News for Black Professionals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Tech News | Breaking News for Black Tech Professionals',
    description:
      'Daily curated tech news highlighting Black innovation, startups, and diversity in technology.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Google tag (gtag.js) - Privacy-First Setup using Next.js Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FMKD0JYBF8"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Set default consent to denied (privacy-first)
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });

              gtag('js', new Date());
              gtag('config', 'G-FMKD0JYBF8', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
              });
            `,
          }}
        />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
