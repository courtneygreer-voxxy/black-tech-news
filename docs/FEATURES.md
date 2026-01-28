# Black Tech News - Feature Documentation

**Last Updated**: January 27, 2026
**Version**: 1.0
**Site URL**: https://blacktechnews.cc

---

## Table of Contents
1. [Article System](#article-system)
2. [Admin Panel](#admin-panel)
3. [Weekly & Monthly Summaries](#weekly--monthly-summaries)
4. [Email Newsletter System](#email-newsletter-system)
5. [User Authentication](#user-authentication)
6. [Analytics & Tracking](#analytics--tracking)

---

## Article System

### Article Display & Discovery
**Purpose**: Aggregate and display Black tech news from multiple sources in a clean, browsable interface.

**Features**:
- Homepage displays latest articles from all sources
- Category filtering: AI, Business, Culture, Startups, etc.
- Individual article pages with full content and metadata
- Source attribution with links to original articles
- Responsive design for mobile and desktop
- SEO-optimized metadata for all pages

**Data Sources**:
- Wolf Development Studio API (`https://wolf-development-studio.vercel.app/api/articles/list`)
- Articles automatically synced from external news sources
- 100+ articles pre-generated for immediate browsing

**User Experience**:
- Click any article to view full details
- Filter by category using navigation menu
- Clean, newspaper-style layout with Black Tech News branding (black, white, red, green color scheme)

---

## Admin Panel

### Admin Authentication
**Purpose**: Secure access to content management features for authorized administrators.

**Access Control**:
- Google OAuth integration via NextAuth.js v5
- Restricted to authorized Google accounts
- Session-based authentication
- Automatic redirect to Google Sign-In for unauthenticated users

**Admin Dashboard** (`/admin`)
- Central hub for all admin features
- Quick access cards for:
  - Article Management
  - Weekly Summaries
  - Monthly Reports
  - Email Subscribers

### Article Management (`/admin/articles`)
**Purpose**: Moderate and control which articles appear on the public site.

**Features**:
- View all articles with search and filters
- Hide/unhide individual articles
- Keyword whitelist/blacklist management for Wolf Studio API
- Bulk article operations
- Article metadata viewing

**Use Cases**:
- Remove off-topic or low-quality articles
- Control content quality and relevance
- Manage article visibility without deleting data

---

## Weekly & Monthly Summaries

### Weekly Digests (`/weekly`)
**Purpose**: Curated weekly roundups of top Black tech news stories with AI-generated insights.

**Admin Features** (`/admin/summaries/weekly`):
- **Auto-Generation**: Click "Create New" to automatically:
  - Pull top 10 articles from the past week (Sunday-Saturday)
  - Generate AI theme using Google Gemini 1.5 Flash
  - Create summary with title, dates, and article list
- **Preview**: View generated summary before publishing
- **Publish Control**: Toggle public visibility
- **Edit Metadata**: View article count, dates, creation info
- **Delete**: Remove summaries from database

**Public Features** (`/weekly`):
- Archive page showing all published weekly digests
- Latest digest highlighted at top
- Past digests in chronological order
- Individual digest pages at `/weekly/[date]`

**Weekly Digest Page** (`/weekly/[date]`):
- AI-generated theme (2-3 paragraphs analyzing the week)
- Top 10 stories from that week
- Links to full article pages
- Publication date and week range
- SEO-optimized with Open Graph tags

**AI Theme Generation**:
- Analyzes top articles from the week
- Identifies trends and patterns
- Highlights significant developments
- Focuses on "why this matters" insights
- Generated using Google Gemini API

### Monthly Reports (`/monthly`)
**Purpose**: Executive-style "State of Black Tech" monthly reports with strategic insights.

**Admin Features** (`/admin/summaries/monthly`):
- Same interface as weekly summaries
- Auto-generates first Monday of each month
- Pulls top 10 articles from previous month
- Creates comprehensive 3-4 paragraph executive summary

**Public Features**:
- Similar structure to weekly archive
- Monthly reports at `/monthly/[date]`
- Focus on big-picture trends and milestones

**Monthly Report Page** (`/monthly/[date]`):
- "State of Black Tech" executive summary
- Top 10 stories from that month
- Strategic insights about the ecosystem
- Breakthrough achievements highlighted

---

## Email Newsletter System

### Subscriber Collection
**Purpose**: Build email list for future newsletter distribution and user engagement.

**Frontend Component** (All Pages):
- Floating "Join our email list" button (bottom-right corner)
- Click opens slide-in panel with signup form
- Displays benefits: weekly digest, funding news, career opportunities, HBCU resources
- Email validation with helpful error messages
- Success confirmation with auto-close
- Prevents duplicate signups with friendly messaging

**Subscription Flow**:
1. User clicks "Join our email list" button
2. Slide-in panel appears from right side
3. User enters email address
4. System validates and checks for duplicates
5. Success message displays
6. Panel auto-closes after 2 seconds

**Duplicate Handling**:
- Active subscribers: Shows "already subscribed" message
- Unsubscribed users: Automatically reactivates subscription
- Bounced emails: Creates new active subscription

### Subscriber Management (`/admin/subscribers`)
**Purpose**: Manage newsletter subscriber list and export email addresses.

**Dashboard Features**:
- **Subscriber Stats**:
  - Total subscribers
  - Active subscribers
  - Unsubscribed count
  - Bounced emails
  - New this week
  - New this month

**List Management**:
- Search by email address
- Filter by status (active/unsubscribed/bounced)
- View subscriber details:
  - Email address
  - Status
  - Source (website, API, etc.)
  - Subscription date
  - Email count sent
- Delete individual subscribers
- Pagination (50 per page)

**Export Functionality**:
- **CSV Export**: Download subscriber list as CSV
- Filters apply to export (e.g., export only active subscribers)
- Includes: email, status, source, subscription date, unsubscribe date

**Database Tracking**:
- IP address (spam prevention)
- User agent (device info)
- Referrer URL (which page they signed up from)
- Subscription timestamp
- Email sending metrics

**Future-Ready Architecture**:
- Placeholder fields for user accounts:
  - First name, last name
  - User ID (foreign key)
  - Preferences (JSONB for email frequency, topics)
- Designed to upgrade to full user system later

---

## User Authentication

### Google OAuth Integration
**Provider**: NextAuth.js v5 with Google Provider

**Configuration**:
- Client ID: `691836186164-vd0lqq8jnm0nolj7ojqj4e01p0oo41fb.apps.googleusercontent.com`
- Environment variables stored in Vercel
- Session-based authentication
- Secure callback URLs

**User Flow**:
1. Click "Admin" or visit `/admin`
2. Redirect to Google Sign-In
3. User authenticates with Google account
4. Authorized users access admin panel
5. Unauthorized users see error message

**Security**:
- Admin routes protected with session checks
- API routes verify authentication before processing
- Unauthorized access returns 401 errors

---

## Analytics & Tracking

### Google Analytics 4
**Property ID**: `G-FMKD0JYBF8`

**Tracking**:
- Page views on all routes
- User navigation patterns
- Article reads and engagement
- Cookie consent preferences
- Anonymized IP addresses

**Privacy Features**:
- Cookie consent banner on first visit
- Analytics granted by default (news site)
- Ad storage denied by default
- SameSite=None; Secure cookies
- GDPR-compliant consent management

**Cookie Banner**:
- Appears on first visit
- Users can accept or decline
- Preferences stored in localStorage
- Non-intrusive design

---

## Technical Infrastructure

### Deployment
- **Platform**: Vercel
- **Domain**: blacktechnews.cc
- **Auto-deployment**: On git push to main branch
- **Build time**: ~40-60 seconds

### Database
- **Provider**: Neon Postgres (serverless)
- **Connection**: Via connection string (POSTGRES_URL)
- **Region**: Washington DC
- **Tier**: Free (0.5GB storage, 120 compute hours)

**Database Tables**:
- `articles` - All fetched articles with metadata
- `sources` - News source configuration
- `hidden_articles` - Admin-managed visibility
- `keywords` - Wolf Studio API filters (whitelist/blacklist)
- `weekly_summaries` - Weekly digest archives
- `monthly_summaries` - Monthly report archives
- `email_subscribers` - Newsletter subscriber list
- `article_views` - Analytics tracking (optional)

### AI Integration
- **Provider**: Google Gemini
- **Model**: Gemini 1.5 Flash
- **Use Cases**:
  - Weekly summary theme generation
  - Monthly report executive summaries
- **API Key**: Stored in Vercel environment variables
- **Rate Limits**: 15 requests/minute, 1M tokens/minute (free tier)

### External Dependencies
- **Wolf Development Studio API**: Article data source
- **Google OAuth**: Authentication provider
- **Google Analytics**: Site tracking
- **Neon Postgres**: Database hosting

---

## Business Rules

### Content Moderation
- Articles can be hidden but not deleted (data preservation)
- Hidden articles don't appear on public site
- Admins can unhide articles at any time
- Keyword filters apply to future article fetches

### Summary Generation
- Weekly summaries cover Sunday-Saturday
- Publication date is the following Monday
- Monthly summaries cover calendar month
- Publication date is first Monday of next month
- Only top 10 articles included in each summary
- AI theme must be generated before saving
- Summaries are drafts by default (not published)

### Email Management
- No duplicate email addresses allowed
- Unsubscribed users can resubscribe
- Bounced emails can be reactivated
- Email addresses stored in lowercase
- Delete action is permanent (no soft delete)

### Access Control
- Admin panel requires Google authentication
- Only authorized Google accounts have access
- Session expires on browser close
- No public user registration

---

## User Personas

### 1. Site Visitor
**Goals**: Discover Black tech news, read articles, stay informed
**Features Used**: Homepage, article pages, category filters

### 2. Newsletter Subscriber
**Goals**: Receive curated Black tech news via email
**Features Used**: Email signup, weekly digests

### 3. Site Administrator
**Goals**: Curate content, generate summaries, manage subscribers
**Features Used**: Admin panel, article management, summary generation, subscriber management

---

## Success Metrics

### Content Metrics
- Articles published per day
- Categories covered
- Source diversity
- Article view counts

### Engagement Metrics
- Weekly digest views
- Monthly report reads
- Newsletter signups
- Return visitor rate

### Quality Metrics
- Articles hidden (moderation quality)
- AI theme relevance
- User retention
- Email list growth

---

## Future Roadmap Considerations

### Email Delivery System
- Integration with email service (SendGrid, Mailchimp, Resend)
- Automated weekly digest delivery
- Email templates with Black Tech News branding
- Unsubscribe link handling
- Bounce management

### User Accounts
- Full user registration system
- User profiles with preferences
- Bookmarked articles
- Reading history
- Personalized email frequency

### Content Expansion
- User comments on articles
- Social sharing features
- Related articles recommendations
- Trending topics section
- Search functionality

### Admin Enhancements
- Batch article operations
- Advanced filtering and sorting
- Summary editing capabilities
- Email campaign scheduling
- Analytics dashboard

---

## Environment Variables

**Required for Production**:
- `POSTGRES_URL` - Neon database connection string
- `GOOGLE_AI_API_KEY` - Gemini API key
- `AUTH_SECRET` - NextAuth.js secret key
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret
- `NEXT_PUBLIC_API_URL` - Wolf Studio API URL (defaults to production)

---

## Support & Maintenance

### Monitoring
- Vercel deployment logs
- Database connection health
- API rate limits (Gemini)
- Error tracking (Next.js built-in)

### Regular Tasks
- Weekly summary generation (Monday mornings)
- Monthly report generation (First Monday of month)
- Article moderation review
- Subscriber list management
- Database backup (Neon automatic)

### Known Limitations
- No automated email sending yet (manual export required)
- No search functionality
- No user-generated content
- No mobile app
- Articles sourced from single API endpoint

---

## Technical Stack Summary

**Frontend**:
- Next.js 16.1.0 with App Router
- React 19
- TypeScript
- Tailwind CSS

**Backend**:
- Next.js API Routes
- NextAuth.js v5
- Neon Postgres
- Google Gemini AI

**Infrastructure**:
- Vercel (hosting & deployment)
- Google Cloud (OAuth, Analytics, AI)
- Neon (database)
- GitHub (source control)

---

**Document End**
