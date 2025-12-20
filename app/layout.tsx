import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
