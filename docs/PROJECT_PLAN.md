# Black Tech News - Product Pivot & Technical Roadmap

**Date**: January 27, 2026
**Version**: 2.0 - Strategic Pivot
**Status**: Planning Phase

---

## Executive Summary

Black Tech News is pivoting from a **"Reading Destination"** (B2C) to **"Content Infrastructure"** (B2P - Business to Professional). We're becoming the **"Associated Press of Black Tech"** - the authoritative source that creators cite when producing content about Black innovation.

### The Core Insight
Our current traffic metrics are low not because the product is broken, but because we built for the wrong user. Influencers and creators "peek" at our content but have no reason to stay. They need **tools, not articles**.

### The New Success Metric
- **Old**: Page views and traffic
- **New**: Citations and export actions (script copies, saves, shares)

We win when someone says: **"According to Black Tech News..."**

---

## Strategic Positioning

### From: News Aggregator (B2C)
- Target: Casual readers
- Goal: Traffic and engagement
- Monetization: Ads, sponsorships
- Problem: Low retention, commodity product

### To: Creator Infrastructure (B2P)
- Target: Influencers, journalists, content creators
- Goal: Citations and workflow integration
- Monetization: Freemium SaaS, API access, creator marketplace
- Advantage: Defensible moat, network effects

---

## User Persona Update

### Primary User: "The Black Tech Creator"

**Profile**:
- TikTok/YouTube creator (10K-500K followers)
- Journalist at tech publication
- Newsletter writer covering Black tech
- Reddit moderator at r/BlackTechNerds

**Jobs to Be Done**:
1. Find accurate, citable Black tech news **fast**
2. Create video scripts in <5 minutes
3. Verify facts to protect their credibility
4. Discover trending stories before competitors

**Pain Points**:
- Researching stories takes 30+ minutes
- Finding primary sources is difficult
- Risk of being scooped on hot topics
- Need to credit sources but info is scattered

**Our Solution**:
- Article pages become "Story Kits" with scripts, data, quotes
- One-click exports reduce time-to-script
- "Receipts" section with verified primary sources
- FOMO indicators show what's trending

---

## Feature Roadmap

### ✅ Phase 0: Foundation (Complete)
**Status**: Live on blacktechnews.cc

- Article aggregation from Wolf Studio API
- Google OAuth admin authentication
- Content moderation (hide/unhide articles)
- Keyword filtering system
- Email subscriber collection
- Gemini AI integration for summaries
- Neon Postgres database
- Vercel deployment pipeline

**Technical Debt**:
- None critical. Infrastructure is solid.

---

### 🚀 Phase 1: Story Kit MVP (Week 1-2)
**Priority**: HIGH - Validate the pivot with minimal investment

#### 1.1 Story Kit Component (Article Pages)
**What**: Transform article pages from "read mode" to "creator mode"

**Features**:
- **The Hook**: One-sentence attention grabber
  - Example: "Black-led drone startup raises $11M from US billionaire"
  - Copy button with tracking

- **The Data**: Key numbers and statistics
  - Example: "$11M Series A • Founded 2023 • Based in Lagos"
  - Formatted for easy citation

- **The Quote**: Pullable sound byte
  - Example: "This investment validates African tech innovation" - CEO Name
  - Attribution included

**UI Design**:
- Prominent "Creator Tools" section at top of article
- Black/red/green brand colors
- One-click copy buttons
- Visual indicators when copied (checkmark animation)

**Event Tracking**:
```javascript
gtag('event', 'hook_copied', { article_id, category })
gtag('event', 'data_copied', { article_id, category })
gtag('event', 'quote_copied', { article_id, category })
```

**Success Criteria**:
- If >20% of visitors copy something → Validate concept
- If <5% copy → Rethink execution

**Effort**: 3-5 days (frontend only, no AI needed yet)

#### 1.2 "Receipts" & Verification Section
**What**: Build trust by showing primary sources

**Features**:
- Collapsible "Sources & Verification" section
- Direct links to:
  - Original press releases
  - LinkedIn profiles (people mentioned)
  - Patent filings (if applicable)
  - Company websites
- "Last verified" timestamp
- Copy button for citation format

**Example**:
```
Sources:
• Original announcement: [TechCrunch link]
• Company profile: [Crunchbase link]
• CEO LinkedIn: [Profile link]
• Last verified: January 27, 2026
```

**Effort**: 2-3 days (manual curation initially, automate later)

**SEO Benefit**: Rich snippets, higher E-E-A-T score

---

### 🎯 Phase 2: User Accounts & "The Vault" (Week 3-4)
**Priority**: MEDIUM - Create stickiness after validation

#### 2.1 User Account System
**Technical Approach**:
- Extend existing NextAuth.js + Google OAuth
- Add `users` table to Neon database
- Merge with `email_subscribers` table (add `user_id` foreign key)

**Database Schema**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Link existing subscribers
ALTER TABLE email_subscribers ADD COLUMN user_id INTEGER REFERENCES users(id);
```

**Features**:
- Sign in with Google (reuse existing OAuth)
- User profile page
- Usage stats: "You've saved 47 articles this month"

**Effort**: 4-5 days

#### 2.2 "The Vault" - Saved Articles
**What**: Personal workspace for creators to organize stories

**Features**:
- Save/unsave articles (heart icon)
- Create folders: "My Tuesday Reels", "Research", "Future Stories"
- Export saved items:
  - CSV with article details
  - Notion database format
  - Google Sheets
- Email digest: "Here's what you saved this week"

**UI Locations**:
- Save button on article cards (homepage)
- Save button on article detail pages
- Vault dashboard at `/vault`

**Success Metric**:
- Users with >5 saved articles return 3x more often

**Effort**: 5-7 days

---

### 🤖 Phase 3: AI Script Generation (Week 5-6)
**Priority**: HIGH - Core workflow integration

#### 3.1 "Creator's Cheat Sheet" Feature
**What**: AI-generated video scripts for every article

**Gemini Prompt Strategy**:
```
You are a scriptwriter for Black tech creators. Given this article:
[article content]

Generate a 60-second TikTok/Reel script with:
1. Hook (first 3 seconds)
2. Problem setup (15 seconds)
3. Solution/outcome (30 seconds)
4. Call to action (12 seconds)

Format:
[HOOK] → [PROBLEM] → [SOLUTION] → [CTA]

Keep it conversational, use "you" language, avoid jargon.
```

**Script Formats**:
1. **TikTok/Reel** (60 seconds)
   - Hook → Problem → Solution
   - 3-point structure

2. **YouTube Short** (3 minutes)
   - Extended version with more context
   - Includes "why this matters"

3. **Thread Format** (Twitter/X)
   - 5-tweet breakdown
   - Each tweet <280 characters

**UI Design**:
- "Generate Script" button on article pages
- Loading state (3-5 seconds)
- Tabbed interface: TikTok | YouTube | Thread
- Copy button for each format
- "Regenerate" option if not satisfied

**Cost Management**:
- Generate on-demand (not pre-generated)
- Cache scripts in database for 7 days
- Free tier: 10 generations/month
- Pro tier: Unlimited

**Database Schema**:
```sql
CREATE TABLE generated_scripts (
  id SERIAL PRIMARY KEY,
  article_id VARCHAR(500) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  script_type VARCHAR(20), -- 'tiktok', 'youtube', 'thread'
  script_content TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN DEFAULT false -- track if copied
);
```

**Event Tracking**:
```javascript
gtag('event', 'script_generated', { format, article_id })
gtag('event', 'script_copied', { format, article_id })
```

**Effort**: 5-7 days

#### 3.2 "Why This Matters" Context
**What**: AI-generated broader implications for creators who need talking points

**Features**:
- 2-3 paragraph analysis
- Connects story to bigger trends
- Perfect for "context" in longer videos

**Effort**: 2 days (reuse Gemini integration)

---

### 📊 Phase 4: Social Proof & Discovery (Week 7)
**Priority**: MEDIUM - FOMO driving

#### 4.1 Live Activity Indicators
**What**: Show what other creators are doing

**Features**:
- "3 creators viewing now" (live counter)
- "12 saves today" (aggregate stats)
- "Trending on Reddit" (pull from r/BlackTechNerds API)

**Technical Approach**:
- WebSocket or polling for live counts
- Redis cache for real-time stats
- Reddit API integration for trending detection

**Effort**: 4-5 days

#### 4.2 "Hot Stories" Algorithm
**What**: Surface stories creators are actually using

**Formula**:
```
Heat Score = (saves * 3) + (script_generations * 5) + (views * 0.1) + recency_boost
```

**UI**:
- "Hot Today" section on homepage
- 🔥 flame icons on trending stories
- Push to top of feed

**Effort**: 3 days

---

### 🔍 Phase 5: SEO Infrastructure (Week 8-9)
**Priority**: HIGH - Organic discovery

#### 5.1 Technical SEO Improvements
**Current State**: Basic SEO in place (meta tags, Open Graph)

**Enhancements**:

1. **Rich Snippets (Schema.org)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "NewsArticle",
     "headline": "...",
     "author": {
       "@type": "Organization",
       "name": "Black Tech News"
     },
     "datePublished": "...",
     "citation": "[Primary source URLs]"
   }
   ```

2. **FAQ Schema** (for "Story Kits")
   - Q: "What's the key takeaway?" A: [The Hook]
   - Q: "What are the numbers?" A: [The Data]
   - Q: "What did they say?" A: [The Quote]

3. **Breadcrumbs**
   - Home → Category → Article
   - Improves Google understanding

4. **Canonical URLs**
   - Already implemented ✅

5. **Sitemap Optimization**
   - Dynamic sitemap.xml
   - Priority scoring for hot articles

**Effort**: 3-4 days

#### 5.2 Content SEO Strategy
**Target Keywords**:
- "Black tech news" (already ranking)
- "Black founders funding"
- "HBCU tech programs"
- "Black AI researchers"
- "[Person name] + Black tech" (long-tail)

**On-Page Optimization**:
- H1: Article title
- H2: The Hook, The Data, The Quote (keyword-rich)
- Alt text for all images
- Internal linking between related articles

**Content Additions**:
- Author bylines (even if "Black Tech News Staff")
- Publish dates (already implemented ✅)
- Update dates when info changes
- Related articles section

**Effort**: Ongoing, 1-2 hours per week

#### 5.3 Backlink Strategy
**Goal**: Get cited by creators (that's our product!)

**Tactics**:
1. **Creator Attribution Program**
   - Public showcase: "Featured Creators" page
   - Creators who cite us get listed
   - Drives more creators to cite us

2. **Reddit Integration**
   - Auto-post new hot stories to r/BlackTechNerds
   - Include "Source: Black Tech News" in body

3. **Press Release Service**
   - Partner with Black PR firms
   - We become the distribution channel

**Effort**: 2-3 days setup, ongoing maintenance

---

## Features to Deprecate

### ❌ Weekly & Monthly Summaries
**Reason**: Not aligned with creator workflow. Summaries are for passive readers, not active creators.

**Action Items**:
1. Remove `/summaries` page (currently "Coming Soon")
2. Keep admin pages for now (low cost to maintain)
3. Remove "Summaries" nav link
4. Archive Gemini summary generation code (may repurpose for "Why This Matters")

**Effort**: 1 hour cleanup

**Database**: Keep `weekly_summaries` and `monthly_summaries` tables (no harm, already created)

---

## Technical Architecture

### Current Stack
- **Frontend**: Next.js 16.1.0, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Database**: Neon Postgres (serverless)
- **AI**: Google Gemini 1.5 Flash
- **Hosting**: Vercel
- **Data Source**: Wolf Studio API

### New Dependencies Needed
- **Redis/Upstash**: Real-time activity counters (Phase 4)
- **Reddit API**: Trending detection (Phase 4)
- None for Phases 1-3 ✅

### Performance Considerations
1. **Gemini API Costs**
   - Free tier: 15 req/min, 1M tokens/min
   - On-demand generation keeps costs low
   - Cache scripts for 7 days
   - Estimated: <$50/month even with 1K users

2. **Database Scaling**
   - Neon free tier: 0.5GB storage, 120 compute hours
   - Should handle 10K users easily
   - Upgrade path: $20/month for 3GB

3. **Vercel Bandwidth**
   - No static images (articles link to external images)
   - Mostly text/JSON → low bandwidth
   - Should stay within free tier

---

## Success Metrics & KPIs

### Phase 1 Validation Metrics
**Goal**: Prove creators want these tools

- **Copy Rate**: % of visitors who copy something
  - Target: >20% = validated
  - Red flag: <5% = rethink

- **Return Visitor Rate**
  - Baseline: ~5% (current)
  - Target: >25% (after Phase 2)

### Phase 2-3 Engagement Metrics
**Goal**: Measure workflow integration

- **Save Rate**: % of users who save articles
  - Target: >40%

- **Script Generation Rate**: Scripts generated per user per month
  - Target: >5

- **Time to Script**: Average time from landing to copying script
  - Target: <3 minutes

### Phase 4-5 Growth Metrics
**Goal**: Organic viral growth

- **Citation Rate**: How often we're cited in creator content
  - Track via: Backlinks, @mentions, Reddit links
  - Target: 50 citations/month by end of Phase 5

- **Creator NPS**: Net Promoter Score among creators
  - Survey: "How likely are you to recommend BTN to other creators?"
  - Target: >50

### Business Metrics (Future)
- **Conversion Rate**: Free → Pro tier
  - Industry standard: 2-5%

- **Monthly Recurring Revenue (MRR)**
  - Phase 6+ (not in this roadmap)

---

## Go-to-Market Strategy

### Phase 1: Stealth Launch (Weeks 1-2)
- Ship Story Kit MVP
- No announcement yet
- Invite 10-20 creators privately for feedback
- Iterate based on usage data

### Phase 2: Soft Launch (Weeks 3-4)
- Announce on r/BlackTechNerds
- Instagram post: "New tools for creators"
- Reach out to 50 micro-influencers directly
- Collect testimonials

### Phase 3: Public Launch (Weeks 5-6)
- Full launch with AI script generation
- Creator showcase: "See how [Name] uses BTN"
- Twitter/X campaign
- Press outreach to Black tech publications

### Phase 4: Community Building (Ongoing)
- Discord server for creators
- Monthly "Hot Stories" newsletter
- "Creator of the Month" feature
- Referral program

---

## Risk Mitigation

### Risk 1: Creators Don't Use the Tools
**Probability**: Medium
**Impact**: High - invalidates entire pivot

**Mitigation**:
- Phase 1 is designed to validate cheaply
- 20% copy rate threshold before further investment
- User interviews every week during Phase 1

### Risk 2: AI Generation Quality Is Poor
**Probability**: Low
**Impact**: Medium

**Mitigation**:
- Gemini 1.5 Flash is proven for text generation
- Allow "regenerate" option
- Human review for first 100 scripts
- Collect thumbs up/down feedback

### Risk 3: SEO Doesn't Drive Creator Traffic
**Probability**: Medium
**Impact**: Medium

**Mitigation**:
- SEO is a long-term play (6-12 months)
- Primary growth comes from creator word-of-mouth
- Reddit integration provides immediate traffic
- Backlink strategy compounds over time

### Risk 4: Cost Overruns (AI API)
**Probability**: Low
**Impact**: Low

**Mitigation**:
- On-demand generation (not pre-generated)
- Cache aggressively (7 days)
- Free tier limits (10 generations/month)
- Monitor costs weekly, circuit breaker at $100/month

---

## Team Responsibilities

### Product Lead
- User research and interviews
- Feature prioritization
- Creator outreach and partnerships

### Technical Lead (Development)
- Phase 1-5 implementation
- Database schema design
- Performance monitoring

### Marketing/Growth
- Reddit community management
- Creator testimonials
- SEO content strategy
- Social media presence

### Designer (If Available)
- Story Kit UI/UX
- Vault dashboard design
- Brand assets for creators

---

## Timeline & Milestones

| Phase | Duration | Key Deliverable | Success Metric |
|-------|----------|----------------|----------------|
| Phase 1 | Week 1-2 | Story Kit MVP | >20% copy rate |
| Phase 2 | Week 3-4 | User accounts + Vault | >40% save rate |
| Phase 3 | Week 5-6 | AI script generation | >5 scripts/user/month |
| Phase 4 | Week 7 | Social proof features | Viral coefficient >1.1 |
| Phase 5 | Week 8-9 | SEO infrastructure | 50 citations/month |

**Total Timeline**: 9 weeks to full feature set

---

## Budget Considerations

### Infrastructure Costs (Monthly)
- Vercel: $0 (free tier sufficient)
- Neon Postgres: $0 → $20 (upgrade if needed)
- Gemini AI: $0 → $50 (scales with usage)
- Redis/Upstash: $0 (free tier sufficient)

**Total Monthly**: $0-70 (scales with success)

### One-Time Costs
- None (all open-source tools)

---

## Appendix A: User Stories

### User Story 1: TikTok Creator
**As** a TikTok creator with 50K followers
**I want** to quickly find accurate Black tech news and create scripts
**So that** I can post 3x per week without spending hours researching

**Acceptance Criteria**:
- Can find relevant story in <2 minutes
- Can copy script in <1 minute
- Can verify sources to protect credibility

### User Story 2: Newsletter Writer
**As** a newsletter writer covering Black tech
**I want** to cite authoritative sources
**So that** my readers trust my content

**Acceptance Criteria**:
- Can find original press releases easily
- Can copy citation-ready quotes
- Can save stories for weekly roundup

### User Story 3: Journalist
**As** a journalist at a tech publication
**I want** to discover trending Black tech stories before competitors
**So that** I can break news first

**Acceptance Criteria**:
- Can see what's trending in real-time
- Can track stories over time
- Can get alerted to hot topics

---

## Appendix B: Competitive Analysis

### Competitors
1. **TechCrunch** - General tech news, minimal Black tech focus
2. **Blavity** - Black news, not tech-focused
3. **AfroTech** - Black tech, but content not creator-friendly
4. **TheRoot** - Culture, not tech

### Our Advantage
- **Only** source optimized for creator workflow
- **Only** source with citation-ready tools
- **Only** source with AI script generation
- **Only** source with "Receipts" verification

### Barriers to Entry
- Data aggregation (we have Wolf Studio)
- Creator community (first-mover advantage)
- AI integration expertise
- SEO momentum (will build over time)

---

## Appendix C: FAQ

### Q: Why pivot from B2C to B2P?
**A**: Our data shows visitors are "peeking" but not staying. They're creators looking for source material, not readers looking for entertainment. B2P has higher LTV and defensible moat.

### Q: Why remove weekly/monthly summaries?
**A**: They serve passive readers, not active creators. Summaries don't help someone make a TikTok video. Resources better spent on Story Kits and script generation.

### Q: What if creators don't cite us?
**A**: Phase 1 validates this risk cheaply. If copy rate is <5%, we'll know immediately and can pivot again. However, early feedback suggests creators WANT to cite authoritative sources.

### Q: How do we compete with ChatGPT for script generation?
**A**: We're not competing with ChatGPT, we're augmenting it. Creators still need to find the story first, verify it, and get citation-ready sources. We provide the "last mile" of the workflow.

### Q: What's the monetization timeline?
**A**: Not in this roadmap. Focus is on proving product-market fit first (Phases 1-5). Monetization comes after we have 1,000+ active creators using the product weekly.

---

**Document End**

_For questions or feedback, contact: [Project Lead]_
