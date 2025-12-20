# Black Tech News

**The News You Need to Know** - Daily curated technology news for Black professionals, startups, and innovation.

## Live Site

🌐 **https://blacktechnews.cc**

## Overview

Black Tech News is a standalone news aggregation platform focused on elevating Black excellence in technology. The site features:

- **Curated News Feed** from trusted sources (Black Enterprise, TechCrunch Diversity, POCIT, and more)
- **Pan-African Design** with red, black, and green color scheme
- **Database Storage** for articles using Google Cloud SQL (PostgreSQL)
- **Professional Magazine Layout** inspired by Vogue and TechCrunch
- **SEO Optimized** with structured data for search engines and GenAI discovery

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Google Cloud SQL (PostgreSQL)
- **Deployment**: Cloudflare Pages
- **RSS Parsing**: rss-parser
- **Web Scraping**: Cheerio

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud SQL instance (PostgreSQL)
- Cloudflare account (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run development server
npm run dev
```

The development server will be available at [http://localhost:3000](http://localhost:3000).

### Database Setup

1. **Create a Google Cloud SQL PostgreSQL instance**
   - Go to Google Cloud Console > SQL
   - Create a new PostgreSQL instance
   - Note the connection details (host, port, database name, user, password)

2. **Run the database schema**
   ```bash
   # Connect to your Cloud SQL instance
   psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME

   # Run the schema file
   \i lib/db/schema.sql
   ```

3. **Update your environment variables**
   Edit `.env.local` with your database credentials:
   ```
   DB_HOST=your-cloud-sql-instance-ip
   DB_PORT=5432
   DB_NAME=blacktechnews
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_SSL=true
   ```

4. **Test the connection**
   The app will automatically test the database connection when it starts.

## Project Structure

```
black-tech-news/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── BTNNavbar.tsx      # Navigation bar
│   ├── BTNHero.tsx        # Hero section
│   ├── BTNFooter.tsx      # Footer
│   ├── ArticleCard.tsx    # Article display component
│   └── StructuredData.tsx # SEO structured data
├── lib/                   # Utilities and business logic
│   ├── news/              # News aggregation
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── sources.ts     # News source configurations
│   └── db/                # Database layer
│       ├── schema.sql     # PostgreSQL schema
│       ├── client.ts      # Database connection
│       └── articles.ts    # Article CRUD operations
├── public/                # Static assets
├── .env.example           # Example environment variables
├── wrangler.toml          # Cloudflare Pages configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
└── package.json           # Dependencies
```

## Deployment

### Cloudflare Pages

1. **Build the static site**
   ```bash
   npm run build
   ```
   This creates an `out/` directory with static files.

2. **Deploy to Cloudflare Pages**
   ```bash
   npm run pages:deploy
   ```

   Or deploy via the Cloudflare Dashboard:
   - Go to Pages > Create a project
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Build output directory: `out`

3. **Set environment variables in Cloudflare**
   - Go to Pages > Your Project > Settings > Environment Variables
   - Add: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`

4. **Connect your domain (blacktechnews.cc)**
   - Go to Pages > Your Project > Custom domains
   - Add `blacktechnews.cc`
   - Update your domain's DNS records at your registrar:
     - Add a CNAME record pointing to your Cloudflare Pages URL

## Features

### News Aggregation
- Fetches articles from multiple RSS feeds
- CORS proxy support for client-side fetching
- Automatic categorization and tagging

### Database Storage
- Articles stored in Google Cloud SQL
- Automatic de-duplication by URL
- View count tracking
- Featured article support
- Old article cleanup

### SEO & Discovery
- Comprehensive metadata for social sharing
- Structured data (Schema.org) for search engines
- GenAI-optimized content structure
- Sitemap generation (coming soon)

### Design
- Pan-African color scheme (red, black, green)
- Magazine-quality typography
- Responsive design for all devices
- Smooth animations and transitions

## Development

### Adding New News Sources

Edit `lib/news/sources.ts`:

```typescript
{
  id: 'new-source',
  name: 'Source Name',
  url: 'https://source.com/feed.rss',
  type: 'rss',
}
```

### Database Operations

```typescript
import { getArticles, upsertArticle } from '@/lib/db/articles';

// Get articles
const articles = await getArticles(50, 0);

// Save an article
await upsertArticle(articleData);
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

© 2025 Black Tech News. All rights reserved.

## Powered By

[Wolf Development Studio](https://www.wolfdevelopmentstudio.com)

## Support

For issues or questions, please contact Wolf Development Studio.
