# Black Tech News - Analytics & Privacy Documentation

## Overview

Black Tech News uses a **privacy-first analytics approach** with Google Analytics 4 (GA4) to understand user behavior and optimize the experience while respecting user privacy.

---

## What We Track

### 1. **Traffic Sources & Referrals**
Track where visitors come from to optimize SEO and partnerships.

- **Referral URLs**: Which sites send traffic to us
- **Search Terms**: What keywords brought users (organic search)
- **UTM Parameters**: Campaign tracking for marketing efforts
- **Social Media**: Traffic from Twitter, LinkedIn, etc.

**GA4 Reports:**
- Acquisition → Traffic acquisition
- Acquisition → User acquisition
- Acquisition → All channels

---

### 2. **Location Data (Anonymized)**
Understand geographic distribution of audience.

- **Country**
- **Region/State**
- **City** (aggregated, not individual)
- **IP Anonymization**: Enabled by default

**GA4 Reports:**
- User → Demographics → Overview
- User → Demographics → Location details

---

### 3. **Article Engagement**

#### Article Clicks
Track which articles get the most engagement.

**Custom Events:**
- `article_click`: When user clicks an article card
- `article_external_click`: When user leaves to read on source site

**Parameters:**
- `article_title`: Title of the article
- `article_url`: URL of the article
- `source_name`: Publication source (e.g., "Black Enterprise")
- `article_position`: Position in the feed (1, 2, 3...)
- `has_image`: Whether article has an image

**Insights:**
- Most clicked articles
- Most popular sources
- Effect of images on click-through rate
- Position bias (do people click top articles more?)

---

### 4. **Outbound Traffic to Partner Sites**
**Critical for partnership reporting** - show sources how much traffic we send them.

**Custom Events:**
- `outbound_click`: When user clicks to visit source site

**Parameters:**
- `source_name`: Destination publication
- `destination_url`: Full URL
- `article_title`: What article they clicked

**Use Case:**
> "Black Enterprise, in November we sent you 15,432 visitors from 3,245 article clicks. Top performing article: 'XYZ' with 892 clicks."

**GA4 Custom Report:**
- Events → `outbound_click`
- Group by `source_name`
- Count total events
- Secondary dimension: `article_title`

---

### 5. **Scroll Depth & Engagement**
Understand how deeply users engage with content.

**Custom Events:**
- `scroll_depth`: Fired at 25%, 50%, 75%, 90%, 100% milestones

**Parameters:**
- `scroll_percentage`: How far they scrolled

**Insights:**
- Are users actually reading?
- Where do they drop off?
- Content quality indicator

---

### 6. **Time on Page**
Measure session duration and engagement quality.

**Custom Events:**
- `time_on_page`: Tracked when user leaves page

**Parameters:**
- `time_seconds`: Total time spent
- `time_minutes`: Rounded to minutes

**Insights:**
- Average session duration
- Highly engaged vs. bounced users
- Quality of traffic by source

---

### 7. **Search & Filtering**
Track how users interact with site features.

**Custom Events:**
- `search`: When users search articles
- `filter_applied`: When users filter by source or tag

**Parameters (Search):**
- `search_term`: What they searched for
- `result_count`: Number of results

**Parameters (Filter):**
- `filter_type`: "source" | "tag" | "search"
- `filter_value`: Which source/tag
- `result_count`: Number of filtered results

**Insights:**
- What topics are users looking for?
- Most used filters
- Search result quality

---

### 8. **Cookie Consent**
Track privacy preference choices.

**Custom Events:**
- `cookie_consent_granted`: User accepted cookies
- `cookie_consent_denied`: User declined cookies

**Parameters:**
- `consent_granted`: true/false
- `consent_timestamp`: When decision made

---

## Privacy-First Approach

### Default State: **Denied**
Before user consents, we:
- ✅ Track page views (no cookies)
- ✅ Track referral sources
- ✅ Track anonymized location
- ❌ **NO** persistent user IDs
- ❌ **NO** cross-site tracking
- ❌ **NO** advertising cookies

### After Consent: **Granted**
When user accepts cookies:
- ✅ All of the above
- ✅ User-level analytics
- ✅ Session tracking
- ✅ Behavioral insights
- ❌ **STILL NO** advertising or remarketing

---

## GA4 Setup

### Enhanced Measurement
Automatically tracked (if enabled in GA4):
- ✅ Page views
- ✅ Scrolls (90% depth)
- ✅ Outbound clicks
- ✅ Site search
- ✅ File downloads
- ✅ Video engagement

### Consent Mode
```javascript
gtag('consent', 'default', {
  'analytics_storage': 'denied',  // Start denied
  'ad_storage': 'denied',         // No ads
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
});
```

After user accepts:
```javascript
gtag('consent', 'update', {
  'analytics_storage': 'granted',  // Enable analytics
});
```

---

## Key Reports to Build

### 1. **Partner Traffic Report**
**Purpose:** Show each publication how much traffic we send them

**Dimensions:**
- Event name: `outbound_click`
- Custom dimension: `source_name`
- Custom dimension: `article_title`

**Metrics:**
- Event count (total clicks)
- Active users (unique visitors sent)

**Filters:**
- Date range: Last 30 days

**Export:** CSV for monthly partner reports

---

### 2. **SEO Performance Report**
**Purpose:** Track which keywords and search terms drive traffic

**Dimensions:**
- First user source/medium
- Session source/medium
- Landing page

**Metrics:**
- New users
- Sessions
- Engagement rate
- Average session duration

**Filters:**
- Source contains "google" or "bing"

---

### 3. **Article Performance Report**
**Purpose:** See which articles get the most engagement

**Dimensions:**
- Event name: `article_click`
- Custom dimension: `article_title`
- Custom dimension: `source_name`

**Metrics:**
- Event count (clicks)
- Users (unique readers)

**Secondary Metrics:**
- `has_image` (image vs. no image performance)
- `article_position` (position bias analysis)

---

### 4. **Geographic Insights**
**Purpose:** Understand audience location

**Dimensions:**
- Country
- Region
- City

**Metrics:**
- Active users
- New users
- Engagement rate
- Events per user

**Use Case:** Target content or partnerships by region

---

### 5. **Engagement Quality Report**
**Purpose:** Measure content quality and user satisfaction

**Dimensions:**
- Landing page
- Source/Medium

**Metrics:**
- Average scroll depth
- Average time on page
- Events per session
- Bounce rate

**Filters:**
- Scroll depth >= 50% (engaged users)
- Time on page >= 30 seconds

---

## Custom Dimensions to Configure in GA4

Go to **Admin → Data display → Custom definitions**

### Event-Scoped Custom Dimensions:
1. **article_title** - Article title
2. **article_url** - Article URL
3. **source_name** - Publication source
4. **destination_url** - Outbound click destination
5. **filter_type** - Type of filter applied
6. **filter_value** - Filter value
7. **search_term** - Search query
8. **article_position** - Position in feed
9. **has_image** - Article has image (true/false)
10. **scroll_percentage** - Scroll depth
11. **time_seconds** - Time on page

---

## API Access for Reporting

### Use GA4 Data API
For automated monthly partner reports:

```python
from google.analytics.data_v1beta import BetaAnalyticsDataClient

# Query outbound clicks by source
request = RunReportRequest(
    property=f"properties/{PROPERTY_ID}",
    date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
    dimensions=[Dimension(name="customEvent:source_name")],
    metrics=[Metric(name="eventCount")],
    dimension_filter=FilterExpression(
        filter=Filter(
            field_name="eventName",
            string_filter=Filter.StringFilter(value="outbound_click")
        )
    )
)
```

---

## Data Retention

**GA4 Settings:**
- Event data retention: **14 months** (maximum)
- User-level data: Anonymized after 14 months
- Aggregate reports: Available indefinitely

**Local Storage:**
- Cookie consent preference: Stored indefinitely
- Cached articles: 5 minutes

---

## Compliance

### GDPR (European Users)
- ✅ Consent before analytics cookies
- ✅ Right to decline
- ✅ Data deletion on request
- ✅ Transparent privacy policy

### CCPA (California Users)
- ✅ Disclosure of data collection
- ✅ Opt-out mechanism (decline button)
- ✅ No sale of personal data

---

## Next Steps

1. **Enable Enhanced Measurement** in GA4
2. **Create Custom Dimensions** listed above
3. **Build Custom Reports** for partner tracking
4. **Set up Data API** for automated reporting
5. **Monthly Partner Reports** - Generate and send to publications

---

*Last Updated: January 2, 2026*
