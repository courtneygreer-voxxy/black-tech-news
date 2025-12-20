import { NewsSource, ScraperConfig } from './types';

export const NEWS_SOURCES: NewsSource[] = [
  // Black-focused tech publications - RSS FEEDS (FAST & RELIABLE)
  {
    id: 'black-enterprise',
    name: 'Black Enterprise',
    url: 'https://www.blackenterprise.com/category/technology/feed/',
    type: 'rss',
    logoUrl: '/sources/black-enterprise.png',
  },
  {
    id: 'techcrunch-diversity',
    name: 'TechCrunch Diversity',
    url: 'https://techcrunch.com/tag/diversity/feed/',
    type: 'rss',
    logoUrl: '/sources/techcrunch.png',
  },

  // Web scraping sources (slower but content-rich)
  {
    id: 'pocit',
    name: 'POCIT',
    url: 'https://peopleofcolorintech.com',
    type: 'scrape',
    logoUrl: '/sources/pocit.png',
  },

  // Note: These don't have public RSS feeds:
  // - Afrotech (JS-rendered site, needs Puppeteer)
  // - Blavity (RSS feed returns 404)
  // - Code2040 (RSS feed returns 404)
  // - Black Girls CODE (site timeout/too slow)
];

// Scraper configurations for each source
export const SCRAPER_CONFIGS: Record<string, ScraperConfig> = {
  afrotech: {
    url: 'https://afrotech.com',
    selectors: {
      article: 'article, .post, .article-item',
      title: 'h2, h3, .article-title, .post-title',
      link: 'a[href]',
      excerpt: '.excerpt, .description, p',
      image: 'img[src]',
      date: 'time, .date, .published',
      author: '.author, .byline',
    },
  },
  'black-enterprise': {
    url: 'https://www.blackenterprise.com/category/technology/',
    selectors: {
      article: 'article, .post',
      title: 'h2, h3, .entry-title',
      link: 'a[href]',
      excerpt: '.excerpt, p',
      image: 'img[src]',
      date: 'time, .date',
      author: '.author',
    },
  },
  'the-root': {
    url: 'https://www.theroot.com/tech',
    selectors: {
      article: 'article, .post',
      title: 'h2, h3',
      link: 'a[href]',
      excerpt: 'p',
      image: 'img',
      date: 'time',
    },
  },
  pocit: {
    url: 'https://peopleofcolorintech.com',
    selectors: {
      article: 'article, .post',
      title: 'h2, h3',
      link: 'a[href]',
      excerpt: 'p',
      image: 'img',
      date: 'time, .date',
    },
  },
};

// Keywords for categorization
export const CATEGORY_KEYWORDS = {
  'startups-funding': [
    'startup',
    'funding',
    'raised',
    'investment',
    'venture capital',
    'vc',
    'seed round',
    'series a',
    'series b',
    'acquisition',
    'ipo',
  ],
  'careers-opportunities': [
    'hiring',
    'jobs',
    'career',
    'recruitment',
    'opportunity',
    'internship',
    'position',
    'application',
    'diversity',
    'inclusion',
  ],
  'innovation-products': [
    'launch',
    'product',
    'innovation',
    'technology',
    'ai',
    'ml',
    'software',
    'app',
    'platform',
    'release',
  ],
  'community-events': [
    'conference',
    'event',
    'meetup',
    'workshop',
    'summit',
    'community',
    'networking',
    'hackathon',
  ],
  'policy-impact': [
    'policy',
    'regulation',
    'law',
    'impact',
    'social',
    'equity',
    'justice',
    'government',
  ],
};

// Keywords to filter for Black tech content
export const BLACK_TECH_KEYWORDS = [
  'black',
  'african american',
  'afro',
  'melanin',
  'diversity',
  'inclusion',
  'underrepresented',
  'minority',
  'poc',
  'people of color',
  'hbcu',
];
