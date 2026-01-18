# GA4 Setup Assistant Prompt for Black Tech News

I need help setting up Google Analytics 4 (GA4) for my news aggregation site, Black Tech News (blacktechnews.cc). I'm new to GA4 and need step-by-step guidance to build custom reports that matter for my use case and hide/remove reports that aren't relevant.

## About My Site

Black Tech News is a news aggregation platform that:
- Curates tech news highlighting Black innovation, startups, and diversity in technology
- Displays articles from various sources (Black Enterprise, TechCrunch, Afrotech, etc.)
- Uses article preview pages to increase engagement before sending users to original sources
- Tracks both inbound traffic (how people find us) and outbound traffic (referrals to partner publishers)

**Business Goals:**
1. Track user engagement and dwell time on preview pages
2. Measure click-through rates to partner publications
3. Understand traffic sources (social media, direct, referrals)
4. Demonstrate value to partner publishers (show them we're sending quality traffic)
5. Optimize content curation based on what articles perform best

## Current GA4 Implementation

**Property ID:** G-FMKD0JYBF8

**Consent Mode Settings:**
- `analytics_storage`: granted (news site, privacy-first)
- `ad_storage`: denied
- `ad_user_data`: denied
- `ad_personalization`: denied
- IP anonymization: enabled

**Enhanced Measurement:**
- Page views with full URL tracking
- Scroll depth tracking
- Time on page tracking

## Custom Events We're Tracking

### 1. Article Interactions
- **Event:** `article_click`
  - **Parameters:** article_title, article_url, source_name, category, author, position, has_image
  - **Purpose:** Track when users click an article card to view preview

- **Event:** `article_view`
  - **Parameters:** article_title, article_url, source_name
  - **Purpose:** Legacy tracking for article views

### 2. Preview Page Engagement
- **Event:** `preview_page_view`
  - **Parameters:** article_id, article_title, article_url, source_name, category, author, has_image, page_type
  - **Purpose:** Track when users land on article preview pages

- **Event:** `preview_page_exit`
  - **Parameters:** article_id, article_title, time_on_page, time_on_page_minutes
  - **Purpose:** Track how long users spend on preview pages before leaving

- **Event:** `preview_to_external`
  - **Parameters:** article_title, article_url, source_name, time_on_preview
  - **Purpose:** Track click-through from preview to external source site

### 3. Outbound Traffic (Most Important for Partner Relations)
- **Event:** `outbound_click`
  - **Parameters:** article_title, article_url, source_name, destination_url, outbound_category, time_on_preview
  - **Purpose:** Track when users click through to partner publications

- **Event:** `article_external_click`
  - **Parameters:** article_title, source_name, destination_url
  - **Purpose:** Secondary tracking for external clicks

### 4. Inbound Traffic Attribution
- **Event:** `inbound_traffic`
  - **Parameters:** utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer
  - **Purpose:** Track how users are finding our site (social media, direct, etc.)

### 5. User Engagement
- **Event:** `scroll_depth`
  - **Parameters:** scroll_percentage
  - **Purpose:** Track how far users scroll on homepage

- **Event:** `time_on_page`
  - **Parameters:** time_spent_seconds, time_spent_minutes
  - **Purpose:** Track homepage engagement time

### 6. Search & Filtering
- **Event:** `search`
  - **Parameters:** search_query, result_count
  - **Purpose:** Track what users search for

- **Event:** `filter_applied`
  - **Parameters:** filter_type, filter_value, result_count
  - **Purpose:** Track source/tag filtering behavior

### 7. Referral Program
- **Event:** `referral_click`
  - **Parameters:** article_title, source_name, referral_source
  - **Purpose:** Track affiliate/referral link clicks

## UTM Parameter Strategy

**Outbound Links (to partner sites):**
- All links to partner publications include:
  - `utm_source=blacktechnews`
  - `utm_medium=referral`
  - `utm_campaign=article_preview`
  - `utm_content=[article_category]`

**Inbound Tracking:**
- We capture UTM parameters from social media posts, email campaigns, etc.
- Parameters stored in session storage for multi-page attribution

## Critical Reports I Need

Please help me build these custom reports in GA4 and provide step-by-step instructions:

### Report 1: "Traffic Sources Dashboard"
**Purpose:** Understand how people are finding Black Tech News
**Key Metrics:**
- Session source/medium breakdown (social, direct, referral, organic)
- New vs. returning users by source
- UTM parameter analysis (campaigns bringing the most traffic)
- Landing page analysis
- Bounce rate by source

**Why it matters:** Need to know which social platforms and marketing efforts are working

---

### Report 2: "Preview Page Performance"
**Purpose:** Measure engagement on article preview pages
**Key Metrics:**
- Total preview page views
- Average time on preview page (from `time_on_page` parameter)
- Preview-to-external click-through rate
- Most viewed articles (by title and source)
- Preview page exit patterns

**Why it matters:** Validates our strategy of using preview pages to increase dwell time

---

### Report 3: "Partner Referral Report"
**Purpose:** Show partner publishers how much traffic we're sending them
**Key Metrics:**
- Total outbound clicks by source (Black Enterprise, TechCrunch, etc.)
- Click-through rate to each partner
- Top articles driving traffic to each partner
- Time spent on preview before clicking through
- Geographic data of users we're sending

**Why it matters:** This is how we demonstrate value to partner publications for potential partnerships

---

### Report 4: "Content Performance"
**Purpose:** Understand which articles and sources perform best
**Key Metrics:**
- Most clicked articles
- Best performing sources (by engagement)
- Category performance (startup news, diversity, innovation, etc.)
- Articles with highest preview-to-external conversion
- Articles with longest time on preview

**Why it matters:** Helps optimize content curation strategy

---

### Report 5: "User Engagement Funnel"
**Purpose:** Track the user journey from landing to external click
**Key Metrics:**
1. Homepage visits
2. Article clicks (to preview)
3. Time on preview page
4. External clicks (to source)
5. Drop-off at each stage

**Why it matters:** Identifies where we're losing users and opportunities to improve

---

### Report 6: "Search & Filter Behavior"
**Purpose:** Understand how users are exploring content
**Key Metrics:**
- Most common search queries
- Most used filters (sources and tags)
- Search result counts
- Conversion rate from search/filter to article click

**Why it matters:** Informs content strategy and UI improvements

---

## Reports to Hide/Remove

Please help me hide or remove these standard GA4 reports that aren't relevant:
- E-commerce reports (we don't sell anything)
- Advertising reports (we don't run ads)
- Monetization reports
- Purchase funnel reports
- Any AI-generated insights about conversion optimization for sales

## Custom Dimensions & Metrics to Register

Please guide me through registering these custom dimensions in GA4:

**Event-Scoped Dimensions:**
- article_title
- article_url
- source_name
- category
- author
- destination_url
- utm_source (from inbound_traffic event)
- utm_medium (from inbound_traffic event)
- utm_campaign (from inbound_traffic event)
- search_query
- filter_type
- filter_value

**Event-Scoped Metrics:**
- time_on_page
- time_on_preview
- scroll_percentage
- position
- result_count

## Specific Questions

1. **How do I fix the "(not set)" issue for session source?**
   - We've already set `analytics_storage: 'granted'` and added enhanced page tracking
   - Is there anything else needed in GA4 settings?

2. **How do I create custom explorations for partner referral reports?**
   - Need to filter by `outbound_click` event
   - Group by `source_name`
   - Show time series data

3. **How do I set up automated weekly email reports?**
   - Want weekly summary of traffic sources, top articles, and outbound clicks

4. **How do I create a real-time dashboard?**
   - Show current users
   - Recent article clicks
   - Recent outbound clicks

5. **How do I export data for partner reports?**
   - Need CSV/PDF reports to share with publishers
   - Filter by date range and specific source

## My Experience Level

- **GA4 Experience:** Complete beginner (just set up property)
- **Previous Analytics:** Some experience with basic Google Analytics (Universal Analytics)
- **Technical Skill:** Comfortable with technical concepts, but need GUI guidance for GA4
- **Goals:** Want to be self-sufficient in GA4 within 2-3 weeks

## What I Need from You

1. **Step-by-step instructions** for creating each custom report (with screenshots/detailed navigation if possible)
2. **Guidance on registering custom dimensions** (where to click, what to name them)
3. **Help configuring my GA4 property** to focus only on relevant metrics
4. **Tips for organizing my GA4 workspace** for easy daily/weekly reporting
5. **Best practices** for news aggregation analytics (if different from e-commerce)
6. **Data retention settings** recommendations for my use case
7. **Alert setup** for unusual traffic drops or spikes

## Timeline

I'd like to have the basic reports (#1, #2, #3) set up this week, and the advanced reports (#4, #5, #6) within the next 2 weeks.

---

**Additional Context:**
- Site is deployed on Cloudflare Pages (static export)
- Built with Next.js 16, React 19
- Mobile-first design (expect high mobile traffic)
- Target audience: Black tech professionals, entrepreneurs, and startup founders

Please provide detailed, actionable guidance that assumes I'm looking at the GA4 interface for the first time. Thank you!
