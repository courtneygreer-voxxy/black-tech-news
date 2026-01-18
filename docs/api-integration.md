# API Integration Guide

> Black Tech News uses a shared API hosted on Wolf Development Studio, allowing both sites to share article data while keeping costs low and maintenance simple.

## Quick Start

```bash
# Use production API (recommended for local dev)
echo "NEXT_PUBLIC_API_URL=https://wolf-development-studio.vercel.app" > .env.local
npm run dev
```

## Architecture

```
┌─────────────────────────────────┐
│  Wolf Development Studio        │
│  (wolfdevelopmentstudio.com)   │
├─────────────────────────────────┤
│  ✅ RSS Feed Fetching           │
│  ✅ Article Caching (30 min)    │
│  ✅ API Routes                   │
│  ✅ View Tracking                │
└─────────────────────────────────┘
           ↑ API Calls
           │
┌─────────────────────────────────┐
│  Black Tech News                │
│  (blacktechnews.cc)            │
├─────────────────────────────────┤
│  ✅ Frontend Only                │
│  ✅ Separate Analytics           │
│  ✅ Separate AdSense             │
│  ✅ Separate Legal/Compliance    │
└─────────────────────────────────┘
```

## Available API Endpoints

All endpoints are hosted at `https://www.wolfdevelopmentstudio.com/api/articles/`

### 1. List Articles

**Endpoint**: `GET /api/articles/list`

**Query Parameters**:
- `limit` (optional): Number of articles to return (default: 50)
- `category` (optional): Filter by category
- `featured` (optional): If "true", returns only featured article

**Response**:
```json
{
  "success": true,
  "articles": [
    {
      "id": "black-enterprise-https://...",
      "title": "Article Title",
      "excerpt": "Article excerpt...",
      "url": "https://...",
      "imageUrl": "https://...",
      "publishedAt": "2025-12-20T00:00:00.000Z",
      "author": "Author Name",
      "source": {
        "id": "black-enterprise",
        "name": "Black Enterprise",
        "url": "https://...",
        "type": "rss"
      },
      "category": "general",
      "tags": []
    }
  ],
  "cached": true,
  "timestamp": 1734653200000
}
```

**Usage**:
```typescript
import { fetchArticles } from '@/lib/api/articles';

const articles = await fetchArticles(50); // Get 50 articles
```

### 2. Featured Article

**Endpoint**: `GET /api/articles/featured`

**Response**:
```json
{
  "success": true,
  "article": { /* article object */ },
  "timestamp": 1734653200000
}
```

**Usage**:
```typescript
import { fetchFeaturedArticle } from '@/lib/api/articles';

const featured = await fetchFeaturedArticle();
```

### 3. Track Article View

**Endpoint**: `POST /api/articles/view`

**Body**:
```json
{
  "articleUrl": "https://example.com/article",
  "articleTitle": "Article Title",
  "source": "Black Enterprise"
}
```

**Response**:
```json
{
  "success": true,
  "viewCount": 42
}
```

**Usage**:
```typescript
import { trackArticleView } from '@/lib/api/articles';

trackArticleView(article.url, article.title, article.source.name);
```

### 4. List News Sources

**Endpoint**: `GET /api/articles/sources`

**Response**:
```json
{
  "success": true,
  "sources": [
    {
      "id": "black-enterprise",
      "name": "Black Enterprise",
      "url": "https://...",
      "type": "rss",
      "logoUrl": "/sources/black-enterprise.png"
    }
  ]
}
```

## Configuration

### Environment Variables

Create `.env.local` in Black Tech News:

```env
# Production - points to Wolf Studio
NEXT_PUBLIC_API_URL=https://www.wolfdevelopmentstudio.com

# Local Development - points to local Wolf Studio
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### API Client

The API client is located at `/lib/api/articles.ts` and `/lib/config.ts`:

```typescript
// lib/config.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://www.wolfdevelopmentstudio.com',
  endpoints: {
    articles: {
      list: '/api/articles/list',
      featured: '/api/articles/featured',
      view: '/api/articles/view',
      sources: '/api/articles/sources',
    },
  },
};
```

## Local Development

### Option 1: Use Production API (Easiest)

```bash
# In Black Tech News
echo "NEXT_PUBLIC_API_URL=https://www.wolfdevelopmentstudio.com" > .env.local
npm run dev
```

### Option 2: Run Wolf Studio Locally

```bash
# Terminal 1: Run Wolf Studio
cd /Users/courtneygreer/Development/wolf-development-studio
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Run Black Tech News (different port)
cd /Users/courtneygreer/Development/black-tech-news
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
npm run dev -- -p 3001
# Runs on http://localhost:3001
```

### Testing the API

```bash
# Test Wolf Studio API directly
curl "https://www.wolfdevelopmentstudio.com/api/articles/list?limit=5"

# Or locally
curl "http://localhost:3000/api/articles/list?limit=5"
```

## Caching Strategy

- Articles are cached for **30 minutes** on Wolf Studio's API
- This reduces RSS feed requests and improves performance
- Cache is shared between Wolf Studio and Black Tech News
- Cache timestamp is included in API responses

## Error Handling

All API functions handle errors gracefully:

```typescript
// If API fails, returns empty array instead of throwing
const articles = await fetchArticles(50); // Returns [] on error
```

Errors are logged to console but don't break the UI.

## Benefits of This Approach

✅ **Shared Infrastructure**: No duplicate databases or RSS fetching
✅ **Lower Costs**: Single API = single infrastructure
✅ **Easy Updates**: Update Wolf Studio API, both sites benefit
✅ **Separate Analytics**: Black Tech News tracks its own metrics
✅ **Separate Monetization**: Black Tech News has its own AdSense
✅ **Scalable**: Can add more sites (News Checker, etc.) using same API

## Future Enhancements

When ready, you can add:

1. **Authentication**: Add API keys for rate limiting
2. **Webhooks**: Real-time updates when new articles are added
3. **Search**: Add full-text search endpoint
4. **Personalization**: User-specific recommendations
5. **Analytics API**: Dedicated endpoint for Mixpanel integration

## Troubleshooting

### Articles not loading

1. Check API URL in `.env.local`
2. Test API directly: `curl https://www.wolfdevelopmentstudio.com/api/articles/list`
3. Check browser console for errors
4. Verify CORS isn't blocking requests

### CORS Errors

If you see CORS errors in development:
- Make sure Wolf Studio is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Try production API URL instead of localhost

### Build Errors

If Black Tech News build fails:
- Ensure all environment variables have `NEXT_PUBLIC_` prefix
- Check that API calls are client-side only (in `useEffect`)
- Verify no server-side database imports remain

## Support

For issues with the API integration, check:
1. Wolf Studio API logs
2. Browser network tab
3. Console errors on both sites

Need help? The API is simple and well-documented. Most issues are configuration-related.

---

*Last updated: January 2026*
