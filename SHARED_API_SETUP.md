# Shared API Setup - Complete! ✅

## What We Built

Successfully set up Black Tech News to use Wolf Development Studio's shared API infrastructure.

## Architecture Overview

```
┌────────────────────────────────────────────────┐
│     Wolf Development Studio (Backend)         │
│     https://www.wolfdevelopmentstudio.com     │
├────────────────────────────────────────────────┤
│  • RSS Feed Fetching (from 2+ sources)        │
│  • Article Caching (30-minute cache)          │
│  • API Routes:                                 │
│    - GET /api/articles/list                   │
│    - GET /api/articles/featured               │
│    - POST /api/articles/view                  │
│    - GET /api/articles/sources                │
│  • View Tracking (in-memory)                  │
│  • Shared Infrastructure                      │
└────────────────────────────────────────────────┘
                    ↕ HTTP/HTTPS API Calls
┌────────────────────────────────────────────────┐
│     Black Tech News (Frontend)                │
│     https://blacktechnews.cc                  │
├────────────────────────────────────────────────┤
│  • Next.js Static Site                        │
│  • Calls Wolf Studio API for articles        │
│  • Separate Domain                            │
│  • Ready for:                                 │
│    - Separate Mixpanel Tracking              │
│    - Google AdSense Integration              │
│    - Own Privacy Policy/Terms                │
└────────────────────────────────────────────────┘
```

## Files Created/Modified

### Wolf Development Studio
✅ **Created**:
- `/app/api/articles/list/route.ts` - Fetch all articles with caching
- `/app/api/articles/featured/route.ts` - Get featured article
- `/app/api/articles/view/route.ts` - Track article views
- `/app/api/articles/sources/route.ts` - List news sources

### Black Tech News
✅ **Created**:
- `/lib/config.ts` - API configuration
- `/lib/api/articles.ts` - API client functions
- `/API_INTEGRATION.md` - API documentation
- `/SHARED_API_SETUP.md` - This file
- `/.env.local.example` - Local development config

✅ **Modified**:
- `/app/page.tsx` - Now uses API instead of direct RSS
- `/components/ArticleCard.tsx` - Tracks views via API
- `/.env.example` - Updated for API-only mode

✅ **Removed Dependencies** (no longer needed):
- Direct database connection
- PostgreSQL client (`pg`)
- Database schema (kept for reference but not used)

## How It Works

1. **Wolf Studio Fetches News**
   - Runs RSS feed parsing
   - Caches articles for 30 minutes
   - Serves via API endpoints

2. **Black Tech News Displays News**
   - Calls Wolf Studio API
   - Displays articles with BTN branding
   - Tracks its own analytics
   - Can add AdSense independently

3. **Shared Benefits**
   - Single source of truth for articles
   - No duplicate RSS fetching
   - Shared caching = faster performance
   - Lower infrastructure costs

## Cost Breakdown (Revised)

**Monthly Costs**:
- Wolf Studio hosting (Cloudflare Pages): $0
- Black Tech News hosting (Cloudflare Pages): $0
- **Total: $0/month** 🎉

**Annual Costs**:
- Domain (blacktechnews.cc): ~$12/year
- **Total: $12/year**

**Saved Costs** (vs. separate infrastructure):
- Google Cloud SQL: ~$96/year saved
- Duplicate infrastructure: ~$100/year saved

## Testing Locally

### Quick Test (Use Production API)
```bash
cd /Users/courtneygreer/Development/black-tech-news
echo "NEXT_PUBLIC_API_URL=https://www.wolfdevelopmentstudio.com" > .env.local
npm run dev
# Visit http://localhost:3000
```

### Full Local Stack
```bash
# Terminal 1: Wolf Studio (API server)
cd /Users/courtneygreer/Development/wolf-development-studio
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Black Tech News (frontend)
cd /Users/courtneygreer/Development/black-tech-news
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
npm run dev -- -p 3001
# Runs on http://localhost:3001
```

### Test API Directly
```bash
# Test article list
curl "http://localhost:3000/api/articles/list?limit=5" | jq

# Test featured article
curl "http://localhost:3000/api/articles/featured" | jq

# Test article view tracking
curl -X POST "http://localhost:3000/api/articles/view" \
  -H "Content-Type: application/json" \
  -d '{"articleUrl":"https://example.com","articleTitle":"Test","source":"BTN"}'
```

## Deployment Steps

### 1. Deploy Wolf Studio (if not already deployed)
```bash
cd /Users/courtneygreer/Development/wolf-development-studio
# Make sure API routes are committed
git add app/api
git commit -m "Add shared API routes for Black Tech News"
git push origin main
# Cloudflare Pages auto-deploys
```

### 2. Deploy Black Tech News
```bash
cd /Users/courtneygreer/Development/black-tech-news

# Set production API URL
echo "NEXT_PUBLIC_API_URL=https://www.wolfdevelopmentstudio.com" > .env.production

# Create GitHub repo (if not done)
git init
git add .
git commit -m "Black Tech News with shared Wolf Studio API"
git remote add origin https://github.com/YOUR_USERNAME/black-tech-news.git
git push -u origin main

# Deploy to Cloudflare Pages
# 1. Go to Cloudflare Dashboard → Pages
# 2. Create new project from GitHub
# 3. Build command: npm run build
# 4. Build output: out
# 5. Add environment variable:
#    NEXT_PUBLIC_API_URL = https://www.wolfdevelopmentstudio.com
```

### 3. Connect Domain
```bash
# In Cloudflare Pages:
# 1. Custom Domains → Add blacktechnews.cc
# 2. Update DNS records at your registrar
# 3. Wait for SSL certificate (automatic)
```

## API Endpoints Reference

### List Articles
```typescript
GET /api/articles/list
Query: ?limit=50&category=general&featured=false

const articles = await fetchArticles(50);
```

### Featured Article
```typescript
GET /api/articles/featured

const featured = await fetchFeaturedArticle();
```

### Track View
```typescript
POST /api/articles/view
Body: { articleUrl, articleTitle, source }

trackArticleView(url, title, source);
```

### List Sources
```typescript
GET /api/articles/sources
```

## Next Steps

Now that the API integration is complete:

### Immediate
1. ✅ Test locally (both sites)
2. ✅ Build passes
3. ⏳ Deploy Wolf Studio (with API routes)
4. ⏳ Deploy Black Tech News
5. ⏳ Connect blacktechnews.cc domain

### Future Enhancements
1. **Mixpanel Integration** (Black Tech News only)
   - Track page views
   - Track article clicks
   - Monitor user behavior

2. **Google AdSense** (Black Tech News only)
   - Apply for AdSense account
   - Add AdSense code to BTN
   - Configure ad placements

3. **Enhanced API Features**
   - Add search endpoint
   - Add category filtering
   - Add pagination
   - Add article recommendations

4. **Database (Optional)**
   - If you want persistent storage later
   - Can add Google Cloud SQL to Wolf Studio
   - API already supports it (schema exists)

## Benefits Achieved

✅ **Cost Savings**: $0/month (vs. $8-30/month with separate DB)
✅ **Separate Domains**: blacktechnews.cc is fully independent
✅ **Shared Data**: Both sites show same articles
✅ **Easy Maintenance**: Update Wolf Studio API → both sites benefit
✅ **Scalable**: Can add more sites using same pattern
✅ **Fast**: 30-minute cache = fast load times
✅ **Simple**: No database to manage on BTN side

## Troubleshooting

### Articles not loading on BTN
- Check `.env.local` has correct API URL
- Test Wolf Studio API: `curl https://www.wolfdevelopmentstudio.com/api/articles/list`
- Check browser console for CORS errors

### API returns empty array
- Wait a few seconds (first load fetches RSS feeds)
- Check Wolf Studio console for RSS fetch errors
- Try different news sources

### Build fails
- Make sure all imports are correct
- Check no leftover database imports
- Verify API URL has `NEXT_PUBLIC_` prefix

## Success Criteria

✅ Wolf Studio has API routes working
✅ Black Tech News calls API successfully
✅ Build completes without errors
✅ No database required on BTN side
✅ Ready for separate analytics/AdSense
✅ Cost: $0/month infrastructure

## Support

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed API documentation.

Questions? Both sites are set up and ready to deploy!
