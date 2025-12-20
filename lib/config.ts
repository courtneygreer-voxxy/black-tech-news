// API Configuration
// Points to Wolf Development Studio's shared API

export const API_CONFIG = {
  // Base URL for Wolf Studio API
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://www.wolfdevelopmentstudio.com',

  // API endpoints
  endpoints: {
    articles: {
      list: '/api/articles/list',
      featured: '/api/articles/featured',
      view: '/api/articles/view',
      sources: '/api/articles/sources',
    },
  },
};

// Helper function to build full API URL
export function getApiUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(endpoint, API_CONFIG.baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
}
