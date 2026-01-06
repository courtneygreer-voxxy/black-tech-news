// Black Tech News Analytics Utility
// Privacy-first analytics with Google Analytics 4

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Analytics Events
export const AnalyticsEvents = {
  // Article Interactions
  ARTICLE_CLICK: 'article_click',
  ARTICLE_VIEW: 'article_view',
  ARTICLE_EXTERNAL_CLICK: 'article_external_click', // Click to source

  // Preview Page Events (granular tracking)
  PREVIEW_PAGE_VIEW: 'preview_page_view', // User lands on preview page
  PREVIEW_PAGE_EXIT: 'preview_page_exit', // User leaves preview page
  PREVIEW_TO_EXTERNAL: 'preview_to_external', // Click-through from preview to external

  // Scroll & Engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',

  // Navigation
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  FILTER_APPLIED: 'filter_applied',

  // Outbound Traffic (to partners)
  OUTBOUND_CLICK: 'outbound_click', // Track clicks to partner sites

  // Cookie Consent
  COOKIE_CONSENT_GRANTED: 'cookie_consent_granted',
  COOKIE_CONSENT_DENIED: 'cookie_consent_denied',
} as const;

// Check if gtag is available
export const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track Page View
export const trackPageView = (url: string) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title,
  });
};

// Track Article Click (when user clicks on an article card)
export const trackArticleClick = (params: {
  articleTitle: string;
  articleUrl: string;
  source: string;
  position: number; // Position in the list
  hasImage: boolean;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.ARTICLE_CLICK, {
    article_title: params.articleTitle,
    article_url: params.articleUrl,
    source_name: params.source,
    article_position: params.position,
    has_image: params.hasImage,
  });
};

// Track External Click (when user leaves to read article on source site)
export const trackExternalClick = (params: {
  articleTitle: string;
  articleUrl: string;
  source: string;
  destination: string;
  timeOnPreviewPage?: number; // Optional: time spent on preview before clicking
}) => {
  if (!isGtagAvailable()) return;

  // Track outbound click to partner site
  window.gtag('event', AnalyticsEvents.OUTBOUND_CLICK, {
    article_title: params.articleTitle,
    article_url: params.articleUrl,
    source_name: params.source,
    destination_url: params.destination,
    outbound_category: 'article_source', // Category for reporting
    time_on_preview: params.timeOnPreviewPage || 0,
  });

  // Also track as external link
  window.gtag('event', AnalyticsEvents.ARTICLE_EXTERNAL_CLICK, {
    article_title: params.articleTitle,
    source_name: params.source,
    destination_url: params.destination,
  });

  // If this came from a preview page, track the click-through
  if (params.timeOnPreviewPage !== undefined) {
    window.gtag('event', AnalyticsEvents.PREVIEW_TO_EXTERNAL, {
      article_title: params.articleTitle,
      article_url: params.articleUrl,
      source_name: params.source,
      time_on_preview: params.timeOnPreviewPage,
    });
  }
};

// Track Scroll Depth
export const trackScrollDepth = (depth: number) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.SCROLL_DEPTH, {
    scroll_percentage: depth,
  });
};

// Track Time on Page
export const trackTimeOnPage = (seconds: number) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.TIME_ON_PAGE, {
    time_seconds: seconds,
    time_minutes: Math.floor(seconds / 60),
  });
};

// Track Search
export const trackSearch = (query: string, resultCount: number) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.SEARCH, {
    search_term: query,
    result_count: resultCount,
  });
};

// Track Filter Applied
export const trackFilterApplied = (params: {
  filterType: 'source' | 'tag' | 'search';
  filterValue: string;
  resultCount: number;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.FILTER_APPLIED, {
    filter_type: params.filterType,
    filter_value: params.filterValue,
    result_count: params.resultCount,
  });
};

// Track Cookie Consent
export const trackCookieConsent = (granted: boolean) => {
  if (!isGtagAvailable()) return;

  const event = granted
    ? AnalyticsEvents.COOKIE_CONSENT_GRANTED
    : AnalyticsEvents.COOKIE_CONSENT_DENIED;

  window.gtag('event', event, {
    consent_granted: granted,
    consent_timestamp: new Date().toISOString(),
  });

  // Update consent mode for GA4
  if (granted) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied', // We don't use ads
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
};

// Set default consent (privacy-first approach)
export const setDefaultConsent = () => {
  if (!isGtagAvailable()) return;

  window.gtag('consent', 'default', {
    analytics_storage: 'denied', // Start denied, enable after consent
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // Wait 500ms for consent update
  });
};

// Enhanced Measurement (automatically tracked by GA4 if enabled)
// These are tracked automatically:
// - Page views
// - Scrolls (90% depth)
// - Outbound clicks
// - Site search (if search param is set)
// - Video engagement
// - File downloads

// Custom hook for tracking time on page
export const useTimeOnPage = () => {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();

  // Track time when user leaves page
  const handleBeforeUnload = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackTimeOnPage(timeSpent);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Custom hook for tracking scroll depth
export const useScrollDepth = () => {
  if (typeof window === 'undefined') return;

  let maxScroll = 0;
  const milestones = [25, 50, 75, 90, 100];
  const trackedMilestones = new Set<number>();

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    const scrollPercentage = Math.floor(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );

    if (scrollPercentage > maxScroll) {
      maxScroll = scrollPercentage;

      // Track milestone achievements
      milestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Track Preview Page View (when user lands on article preview page)
export const trackPreviewPageView = (params: {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  source: string;
  category: string;
  author: string;
  hasImage: boolean;
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.PREVIEW_PAGE_VIEW, {
    article_id: params.articleId,
    article_title: params.articleTitle,
    article_url: params.articleUrl,
    source_name: params.source,
    category: params.category,
    author: params.author,
    has_image: params.hasImage,
    page_type: 'preview',
  });

  // Also track as page view
  window.gtag('event', AnalyticsEvents.PAGE_VIEW, {
    page_path: `/article/${params.articleId}`,
    page_title: params.articleTitle,
    page_type: 'preview',
  });
};

// Track Preview Page Exit (when user leaves preview page)
export const trackPreviewPageExit = (params: {
  articleId: string;
  articleTitle: string;
  timeOnPage: number; // Time in seconds
}) => {
  if (!isGtagAvailable()) return;

  window.gtag('event', AnalyticsEvents.PREVIEW_PAGE_EXIT, {
    article_id: params.articleId,
    article_title: params.articleTitle,
    time_on_page: params.timeOnPage,
    time_on_page_minutes: Math.floor(params.timeOnPage / 60),
  });
};

// ===== UTM Parameter Utilities =====

/**
 * Append UTM parameters to a URL for tracking outbound traffic
 * This allows partner sites to see that traffic came from Black Tech News
 */
export const appendUTMParams = (
  url: string,
  params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  }
): string => {
  try {
    const urlObj = new URL(url);

    // Default UTM parameters for Black Tech News
    const defaultParams = {
      utm_source: params?.source || 'blacktechnews',
      utm_medium: params?.medium || 'referral',
      utm_campaign: params?.campaign || 'article_referral',
    };

    // Add optional parameters if provided
    if (params?.content) {
      urlObj.searchParams.set('utm_content', params.content);
    }
    if (params?.term) {
      urlObj.searchParams.set('utm_term', params.term);
    }

    // Set default parameters
    Object.entries(defaultParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });

    return urlObj.toString();
  } catch (error) {
    console.error('Error appending UTM parameters:', error);
    return url; // Return original URL if there's an error
  }
};

/**
 * Extract UTM parameters from the current URL
 * Used to track how users are finding the site
 */
export const getUTMParams = (): {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
} | null => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const utmParams: any = {};

  // Extract all UTM parameters
  ['source', 'medium', 'campaign', 'content', 'term'].forEach((param) => {
    const value = params.get(`utm_${param}`);
    if (value) {
      utmParams[param] = value;
    }
  });

  return Object.keys(utmParams).length > 0 ? utmParams : null;
};

/**
 * Track inbound UTM parameters (how users found the site)
 * Should be called on page load
 */
export const trackInboundUTM = () => {
  if (!isGtagAvailable()) return;

  const utmParams = getUTMParams();

  if (utmParams) {
    window.gtag('event', 'inbound_traffic', {
      utm_source: utmParams.source,
      utm_medium: utmParams.medium,
      utm_campaign: utmParams.campaign,
      utm_content: utmParams.content,
      utm_term: utmParams.term,
      referrer: document.referrer || 'direct',
    });

    // Store in session storage for attribution across page views
    sessionStorage.setItem('btn_utm_params', JSON.stringify(utmParams));
  }
};
