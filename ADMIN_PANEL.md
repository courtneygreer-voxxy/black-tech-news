# Black Tech News - Admin Panel

## Overview

The admin panel provides secure, Google-authenticated access to manage Black Tech News content and keyword filtering for Wolf Development Studio API.

## Features

### 1. Authentication
- **Google OAuth Sign-In**: Secure authentication using your Gmail account
- **Single Admin Access**: Restricted to the email configured in `ADMIN_EMAIL`
- **Protected Routes**: All `/admin/*` routes require authentication

### 2. Article Management (`/admin/articles`)
- View all articles from Wolf Development Studio API
- Hide/show articles that aren't appropriate for the site
- Filter view: All, Visible, or Hidden articles
- Quick preview of article content
- View counts and metadata
- Direct links to original sources

### 3. Keyword Management (`/admin/keywords`)
- **Whitelist**: Keywords that prioritize content (articles with these keywords are featured)
- **Blacklist**: Keywords that filter out content (articles with these keywords are hidden)
- Real-time keyword addition/removal
- Sync preferences to Wolf Development Studio API
- Case-insensitive keyword matching

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Auth**: NextAuth.js v5 with Google Provider
- **Database**: PostgreSQL (Google Cloud SQL)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Access

- **Admin Dashboard**: `https://your-domain.com/admin`
- **Article Management**: `https://your-domain.com/admin/articles`
- **Keyword Management**: `https://your-domain.com/admin/keywords`

## Setup Instructions

See [docs/admin-setup.md](docs/admin-setup.md) for complete setup instructions including:
- Google OAuth configuration
- Environment variables
- Database setup
- Vercel deployment
- Wolf Development Studio integration

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Google OAuth credentials
   - Add your admin email address
   - Configure database connection
   - Add Wolf Studio API key

3. **Run database migrations**:
   ```bash
   psql -h your-db-host -U btnuser -d blacktechnews -f lib/db/schema.sql
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access admin panel**:
   - Navigate to `http://localhost:3000/admin`
   - Sign in with your configured Gmail account

## Environment Variables

Required variables for admin panel:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Admin
ADMIN_EMAIL=your-email@gmail.com
AUTH_SECRET=your-random-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000

# Wolf Studio
WOLF_STUDIO_API_KEY=your-api-key

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=blacktechnews
DB_USER=btnuser
DB_PASSWORD=your-password
DB_SSL=true
```

## Security

- All admin routes protected by middleware
- Authentication required for all API endpoints
- Database credentials stored in environment variables
- OAuth secrets never committed to version control
- Single admin user access only

## Database Schema

### `hidden_articles`
Stores articles that have been hidden by admin.

### `keywords`
Stores whitelist and blacklist keywords for content filtering.

## API Endpoints

### Admin API Routes

- `POST /api/admin/articles/hide` - Hide/show an article
- `GET /api/admin/articles/hide` - Get list of hidden articles
- `GET /api/admin/keywords` - Get keyword lists
- `POST /api/admin/keywords` - Save keyword lists
- `POST /api/admin/keywords/sync` - Sync keywords to Wolf Studio

### Authentication Routes

- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/signout` - Sign out endpoint

## Wolf Development Studio Integration

The keyword management feature syncs preferences to Wolf Development Studio API:

**Expected Endpoint**: `POST /api/admin/keywords`

**Request Format**:
```json
{
  "whitelist": ["ai", "blockchain", "startup"],
  "blacklist": ["spam", "unrelated"],
  "source": "black-tech-news",
  "updated_by": "admin@example.com"
}
```

This allows Wolf Studio's RSS engine to filter content based on your preferences.

## Troubleshooting

### Can't access admin panel
- Verify `ADMIN_EMAIL` matches your Gmail exactly
- Check that you're added as a test user in Google Cloud Console
- Clear browser cache and cookies
- Check browser console for errors

### Database connection errors
- Verify database credentials in `.env.local`
- Ensure database accepts connections from your IP
- Check that database tables exist (run schema.sql)

### Keyword sync fails
- Verify `WOLF_STUDIO_API_KEY` is set
- Check that Wolf Studio endpoint exists
- Review network tab in browser dev tools

## Development

### Local Testing

```bash
# Run dev server
npm run dev

# Access admin at
http://localhost:3000/admin
```

### Production Deployment

```bash
# Deploy to Vercel
vercel --prod
```

Make sure to update Google OAuth redirect URIs with your production domain.

## Future Enhancements

Potential features for future development:
- Article scheduling and publishing
- Bulk article operations
- Analytics dashboard with charts
- Content moderation workflows
- Multi-admin support with roles
- Email notifications for new articles
- API rate limiting and monitoring

## Support

For issues or questions:
1. Check [docs/admin-setup.md](docs/admin-setup.md) for setup help
2. Review environment variables configuration
3. Check database connection and schema
4. Verify Google OAuth settings

---

**Last Updated**: January 2026
