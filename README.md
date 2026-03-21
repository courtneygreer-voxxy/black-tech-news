# Black Tech News

> **Your Pulse on Black Innovation** - Celebrating Black excellence in technology, startups, and digital culture.

Black Tech News is a premium news aggregator showcasing the latest innovations, achievements, and opportunities in Black tech. Powered by the [Wolf Development Studio API](https://github.com/courtneygreer-voxxy/wolf-development-studio).

---

## 🌐 Live Site

**https://blacktechnews.cc** (coming soon)

---

## ✨ Features

### Curated Content
- **Hand-picked sources** from trusted Black tech publications
- **Image-prioritized layout** for visual appeal
- **Real-time updates** from RSS feeds
- **Clean, magazine-quality design** inspired by Vogue and TechCrunch

### Weekly Digests
- **Automated weekly summaries** published every Monday at 6:00 AM EST
- **AI-generated themes** analyzing top stories and trends
- **Educational focus** for students, professionals, and founders
- **Archive building naturally** week-by-week

### Pan-African Design
- **Red, Black, Green color scheme** celebrating Pan-African heritage
- **Professional typography** with modern styling
- **Responsive layout** optimized for all devices
- **Smooth animations** for enhanced user experience

### SEO & Discoverability
- **Education-focused metadata** targeting HBCUs and students
- **AI-parseable structure** for LLM consumption
- **Schema.org structured data** for rich search results
- **Weekly citation velocity** for authority building

---

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.0 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Wolf Development Studio (Vercel)
- **Deployment**: Vercel
- **Date Handling**: date-fns

---

## 💻 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to Wolf Development Studio API (public)

### Installation

```bash
# Clone the repository
git clone https://github.com/courtneygreer-voxxy/black-tech-news.git
cd black-tech-news

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The development server will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```env
# Wolf Development Studio API URL
NEXT_PUBLIC_API_URL=https://wolf-development-studio.vercel.app
```

---

## 📁 Project Structure

```
black-tech-news/
├── app/
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Homepage with article feed
│   ├── weekly/
│   │   ├── page.tsx            # Weekly digest archive
│   │   └── [date]/page.tsx     # Individual weekly digest
│   └── globals.css             # Global styles and animations
├── components/
│   ├── BTNNavbar.tsx           # Navigation bar
│   ├── BTNHero.tsx             # Hero section ("Your Pulse on Black Innovation")
│   ├── BTNFooter.tsx           # Footer with Wolf Studio branding
│   ├── HeroArticle.tsx         # Featured article card
│   ├── ArticleCard.tsx         # Article grid card
│   └── ArticleFilters.tsx      # Filter controls (future)
├── lib/
│   ├── api/
│   │   └── articles.ts         # API integration & client-side sorting
│   ├── weekly/
│   │   ├── types.ts            # Weekly digest TypeScript types
│   │   └── generator.ts        # Weekly digest generation logic
│   ├── config.ts               # API configuration
│   └── news/
│       └── types.ts            # TypeScript interfaces
├── .github/
│   └── workflows/
│       └── weekly-digest.yml   # Monday 6 AM automation
├── public/
│   └── sources/                # Source logos
├── .env.local                  # Environment variables (not committed)
├── next.config.ts              # Next.js configuration
└── tailwind.config.ts          # Tailwind configuration
```

---

## 🎨 Key Components

### Hero Section
```typescript
// components/BTNHero.tsx
"Your Pulse on Black Innovation"
"Celebrating Black excellence in technology, startups, and digital culture"
```

### Article Sorting
Black Tech News implements **client-side image prioritization**:
- Articles with images appear first
- Then sorted by publication date (newest first)
- Provides optimal visual experience for readers

```typescript
// lib/api/articles.ts
articles.sort((a, b) => {
  const aHasImage = a.imageUrl ? 1 : 0;
  const bHasImage = b.imageUrl ? 1 : 0;

  if (aHasImage !== bHasImage) {
    return bHasImage - aHasImage; // Images first
  }

  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** in the Vercel Dashboard
2. Vercel auto-detects Next.js — no build configuration needed
3. **Set environment variables** in Vercel Dashboard → Settings → Environment Variables
4. **Configure custom domain**: `blacktechnews.cc`

---

## 🔧 Configuration

### API Integration

Black Tech News consumes the Wolf Development Studio API:

```typescript
// lib/config.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://wolf-development-studio.vercel.app',
  endpoints: {
    articles: {
      list: '/api/articles/list',
      featured: '/api/articles/featured',
      view: '/api/articles/view',
    },
  },
};
```

### Fetching Articles

```typescript
import { fetchArticles } from '@/lib/api/articles';

const articles = await fetchArticles(50); // Get 50 articles
```

### Tracking Views

```typescript
import { trackArticleView } from '@/lib/api/articles';

trackArticleView(articleUrl, articleTitle, sourceName);
```

---

## 🎯 Roadmap

### Current Features
- [x] Wolf Studio API integration
- [x] Client-side image prioritization
- [x] Pan-African design system
- [x] Responsive layout
- [x] Article view tracking
- [x] Weekly digest automation (Mondays 6 AM EST)
- [x] SEO optimization for education sector
- [x] Privacy-first analytics system

### Coming Soon
- [ ] Claude AI integration for theme analysis
- [ ] User bookmarking (save articles)
- [ ] Email newsletter sign-up
- [ ] Social sharing enhancements
- [ ] Category browsing (topics)
- [ ] Search functionality
- [ ] Dark mode support
- [ ] PWA (Progressive Web App) support

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Integration](./docs/api-integration.md) | Wolf Studio API setup and usage |
| [Deployment](./docs/deployment.md) | Cloudflare Pages deployment guide |
| [Analytics](./docs/analytics.md) | GA4 setup and privacy documentation |
| [Monitoring](./docs/monitoring.md) | Health checks and alerting |
| [Troubleshooting](./docs/troubleshooting-404.md) | Debugging 404 errors |
| [Migration Summary](./docs/migration-summary.md) | Project migration history |

---

## 🔗 Related Projects

- **[Wolf Development Studio API](https://github.com/courtneygreer-voxxy/wolf-development-studio)** - The backend API powering this site
- **Infinity Minds** - AI Startup Tracker (planned)
- **News Checker** - News Validity System (planned)
- **Spin the Globe News** - Global News Platform (planned)

---

## 📄 License

© 2026 Black Tech News. All rights reserved.

---

## 🙏 Acknowledgments

**Powered by [Wolf Development Studio](https://github.com/courtneygreer-voxxy/wolf-development-studio)**

Thank you to all the Black tech publications whose content we aggregate and amplify. This platform exists to celebrate and elevate your voices.

### News Sources
- Black Enterprise
- Afrotech
- UrbanGeekz
- Wired (Black tech content)
- And more...

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/courtneygreer-voxxy/black-tech-news/issues)
- **Documentation**: [docs/](./docs/)
- **Wolf Studio API**: [github.com/courtneygreer-voxxy/wolf-development-studio](https://github.com/courtneygreer-voxxy/wolf-development-studio)

---

**Built with ❤️ for the Black tech community**
