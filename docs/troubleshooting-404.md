# Troubleshooting 404 Errors

> Guide for debugging article preview 404 errors on the static site.

## Common Causes

### 1. **New Articles Added After Build**
**Symptom:** Hero article or recent articles show 404 when clicked
**Root Cause:** Static site generation (SSG) creates HTML files at build time. New articles added to the API after deployment won't have pre-generated pages.

**Quick Fix:**
- Trigger a new build/deployment in Cloudflare Pages
- Or wait for next automatic deployment

**Long-term Solutions:**
- Switch to ISR (Incremental Static Regeneration) - not supported by Cloudflare Pages
- Implement client-side routing fallback
- Use dynamic rendering for article pages (loses SSG SEO benefits)

### 2. **Article ID Encoding Issues**
**Symptom:** Some article links work, others don't
**Root Cause:** Article IDs contain special characters that break base64url encoding/decoding

**Debug Steps:**
```bash
# 1. Check the article ID from API
curl https://black-tech-news-api.wolf-studio.workers.dev/api/articles?limit=50 | jq -r '.articles[] | .id'

# 2. Test encoding/decoding in Node.js
node -e "
const id = 'YOUR_ARTICLE_ID_HERE';
const encoded = Buffer.from(id, 'utf-8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
console.log('Encoded:', encoded);
const decoded = Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (4 - (encoded.length % 4)) % 4), 'base64').toString('utf-8');
console.log('Decoded:', decoded);
console.log('Match:', id === decoded);
"

# 3. Check if file exists in build
ls out/article/ | grep ENCODED_ID
```

**Potential Fixes:**
- Validate article IDs don't contain null bytes or invalid UTF-8
- Add error handling in decode function
- Fallback to client-side fetch if static file missing

### 3. **Cache Mismatch**
**Symptom:** 404 on production but works locally
**Root Cause:** localStorage cache on client has different articles than build-time API response

**Debug:**
```javascript
// In browser console
const cached = localStorage.getItem('btn_articles');
const articles = JSON.parse(cached);
console.log('Cached articles:', articles.length);
console.log('Article IDs:', articles.map(a => a.id));
```

**Fix:**
- Clear localStorage: `localStorage.removeItem('btn_articles')`
- Refresh page
- Check if article now loads

### 4. **Build Cache Issues**
**Symptom:** Recent code changes not reflected in production
**Root Cause:** Cloudflare or Next.js build cache

**Fix:**
```bash
# Locally
rm -rf .next out node_modules/.cache

# In Cloudflare
# Go to Pages > Settings > Builds & deployments > Clear build cache
```

### 5. **API Response Changed**
**Symptom:** All article previews 404
**Root Cause:** API changed article ID format or structure

**Debug:**
```bash
# Check current API response structure
curl https://black-tech-news-api.wolf-studio.workers.dev/api/articles?limit=1 | jq '.'

# Compare to expected structure
# Articles should have: id, title, url, excerpt, imageUrl, publishedAt, author, source, category, tags
```

## Emergency Fixes

### Remove Problematic Article
If one specific article is causing issues, temporarily filter it out:

```typescript
// In lib/api/articles.ts - fetchArticles function
const articles = data.articles
  .filter(article => {
    // Filter out problematic article IDs
    const problematicIds = [
      'specific-article-id-here',
    ];
    return !problematicIds.includes(article.id);
  })
  .map(article => ({
    ...article,
    publishedAt: new Date(article.publishedAt),
  }));
```

### Disable Hero Article Temporarily
```typescript
// In app/page.tsx
const heroArticle = null; // filteredArticles[0];
const regularArticles = filteredArticles; // Remove slicing logic
```

## Monitoring & Prevention

### Add Error Logging
```typescript
// In components/ArticlePreviewClient.tsx
useEffect(() => {
  const loadArticle = async () => {
    try {
      // ... existing code

      if (!found) {
        // Log to analytics or error tracking
        console.error('[ArticlePreview] Article not found:', {
          articleId,
          cachedCount: articles?.length,
          timestamp: new Date().toISOString(),
        });

        // Track in GA4
        window.gtag?.('event', 'article_not_found', {
          article_id: articleId,
          cached_count: articles?.length,
        });
      }
    } catch (error) {
      console.error('[ArticlePreview] Load error:', error);
    }
  };
}, [articleId]);
```

### Build-time Validation
Add to `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  try {
    const articles = await fetchArticles(50);

    // Validate all IDs can be encoded/decoded
    const validArticles = articles.filter(article => {
      try {
        const encoded = encodeArticleId(article.id);
        const decoded = decodeArticleId(encoded);
        if (decoded !== article.id) {
          console.error('Encoding mismatch:', article.id);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Invalid article ID:', article.id, error);
        return false;
      }
    });

    console.log(`Generating ${validArticles.length}/${articles.length} article pages`);

    return validArticles.map((article) => ({
      id: encodeArticleId(article.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
```

## Contact Support

If none of these fixes work:
1. Check Cloudflare Pages build logs
2. Verify API is responding correctly
3. Check browser console for JavaScript errors
4. Review recent git commits for breaking changes
5. Test locally with `npm run build && npx serve out`

## Related Files
- `/app/article/[id]/page.tsx` - Static generation
- `/components/ArticlePreviewClient.tsx` - Client-side loading
- `/lib/utils.ts` - Encoding/decoding functions
- `/lib/api/articles.ts` - API fetching

---

*Last updated: January 2026*
