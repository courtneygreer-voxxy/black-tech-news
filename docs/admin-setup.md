# Admin Panel Setup Guide

This guide will walk you through setting up the Black Tech News admin panel with Google authentication.

## Overview

The admin panel allows you to:
- View daily articles from Wolf Development Studio API
- Hide/show articles that aren't appropriate
- Manage keyword filters (whitelist/blacklist)
- Sync keyword preferences to Wolf Development Studio

## Prerequisites

- Google Cloud Platform account
- Vercel account (for deployment)
- PostgreSQL database (Google Cloud SQL or other)
- Wolf Development Studio API access

## Step 1: Set Up Google OAuth

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

### 1.2 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the OAuth consent screen if prompted:
   - User Type: External (or Internal if you have Google Workspace)
   - App name: "Black Tech News Admin"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `email` and `profile`
   - Test users: Add your Gmail address
4. Create OAuth client ID:
   - Application type: Web application
   - Name: "Black Tech News"
   - Authorized JavaScript origins:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.vercel.app`
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.vercel.app/api/auth/callback/google`
5. Click "Create"
6. Save the **Client ID** and **Client Secret** - you'll need these

## Step 2: Set Up Environment Variables

### 2.1 Local Development

Create a `.env.local` file in the root of your project:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Admin Email (your Gmail address - only this email can access admin)
ADMIN_EMAIL=your-email@gmail.com

# NextAuth Configuration
AUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Wolf Development Studio API
NEXT_PUBLIC_API_URL=https://www.wolfdevelopmentstudio.com
WOLF_STUDIO_API_KEY=your-wolf-studio-api-key-here

# Database (Google Cloud SQL or other PostgreSQL)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=blacktechnews
DB_USER=btnuser
DB_PASSWORD=your-db-password
DB_SSL=true
```

### 2.2 Generate AUTH_SECRET

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `AUTH_SECRET`.

### 2.3 Production (Vercel)

1. Go to your Vercel project
2. Navigate to "Settings" > "Environment Variables"
3. Add all the variables from `.env.local`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (use your production URL, e.g., `https://blacktechnews.vercel.app`)
   - `NEXT_PUBLIC_API_URL`
   - `WOLF_STUDIO_API_KEY`
   - Database variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`

## Step 3: Set Up Database

### 3.1 Create Database Tables

Run the SQL schema to create the required tables:

```bash
psql -h your-db-host -U btnuser -d blacktechnews -f lib/db/schema.sql
```

Or connect to your database and run the schema manually from [lib/db/schema.sql](../lib/db/schema.sql).

The schema includes:
- `articles` - Stores articles from Wolf Studio
- `sources` - News sources
- `article_views` - View tracking
- `hidden_articles` - Admin-hidden articles
- `keywords` - Whitelist/blacklist keywords

### 3.2 Verify Database Connection

Make sure your database connection details are correct in `.env.local`.

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 4.2 Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Or push to GitHub and deploy via Vercel's GitHub integration.

### 4.3 Update OAuth Redirect URIs

After deploying, go back to Google Cloud Console and add your production URL to the authorized redirect URIs:
- `https://your-actual-domain.vercel.app/api/auth/callback/google`

## Step 5: Access the Admin Panel

1. Navigate to `/admin` on your site
2. Click "Sign in with Google"
3. Sign in with the Gmail account specified in `ADMIN_EMAIL`
4. You should now have access to:
   - `/admin` - Dashboard
   - `/admin/articles` - Article management
   - `/admin/keywords` - Keyword management

## Step 6: Configure Wolf Development Studio Integration

The keyword sync feature requires Wolf Development Studio API to have an endpoint that accepts keyword preferences.

### Expected API Format

```typescript
POST /api/admin/keywords
Authorization: Bearer YOUR_WOLF_STUDIO_API_KEY
Content-Type: application/json

{
  "whitelist": ["ai", "blockchain", "startup"],
  "blacklist": ["spam", "unrelated"],
  "source": "black-tech-news",
  "updated_by": "admin@example.com"
}
```

You'll need to coordinate with Wolf Development Studio to:
1. Create this API endpoint
2. Provide you with an API key (`WOLF_STUDIO_API_KEY`)
3. Configure the endpoint to accept and apply keyword filters

## Troubleshooting

### "Access Denied" Error

- Verify your Gmail address matches exactly with `ADMIN_EMAIL` in environment variables
- Check that the email is added as a test user in Google Cloud Console (if app is in testing mode)

### Database Connection Errors

- Verify database credentials in environment variables
- Check that your database allows connections from Vercel's IP addresses
- For Google Cloud SQL, you may need to enable the Cloud SQL Admin API

### OAuth Errors

- Ensure redirect URIs in Google Cloud Console exactly match your domain
- Verify `NEXTAUTH_URL` matches your actual domain
- Check that Google+ API is enabled in your Google Cloud project

### Keyword Sync Fails

- Verify `WOLF_STUDIO_API_KEY` is set correctly
- Check that Wolf Development Studio API endpoint exists and is accessible
- Review the API response in browser dev tools

## Security Notes

1. **Never commit `.env.local` to version control** - it contains sensitive credentials
2. The admin panel is restricted to the single email in `ADMIN_EMAIL`
3. All admin routes are protected by middleware
4. Database credentials should use strong passwords
5. Rotate `AUTH_SECRET` periodically

## Next Steps

- Customize the admin UI as needed
- Add more analytics to the dashboard
- Implement article approval workflows
- Add automated testing for admin features
