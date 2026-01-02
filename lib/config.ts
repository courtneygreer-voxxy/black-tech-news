// API Configuration
// Points to Wolf Development Studio's shared API

export const API_CONFIG = {
  // Base URL for Wolf Studio API
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app',

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
  // Build the full URL by combining base URL with endpoint
  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${endpointPath}`;

  const url = new URL(fullUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
}
