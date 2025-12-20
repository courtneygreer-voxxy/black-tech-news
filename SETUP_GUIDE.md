# Black Tech News - Complete Setup Guide

This guide will walk you through setting up Black Tech News from scratch to production deployment.

## Quick Start (5 minutes)

```bash
# 1. Navigate to the project
cd /Users/courtneygreer/Development/black-tech-news

# 2. Install dependencies
npm install

# 3. Run locally (no database needed for testing)
npm run dev

# 4. Open http://localhost:3000
```

The site will work immediately with RSS feeds, no database required for local testing!

## Production Setup (30-60 minutes)

### Step 1: Google Cloud SQL Setup

#### Create PostgreSQL Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com/sql)
2. Click **Create Instance** > **Choose PostgreSQL**
3. Configure:
   - **Instance ID**: `blacktechnews-db`
   - **Password**: Set a strong password for postgres user
   - **Database version**: PostgreSQL 15
   - **Region**: `us-central1` (or closest to your users)
   - **Zonal availability**: Single zone
   - **Machine type**: Shared core (1 vCPU, 0.614 GB)
   - **Storage**: 10 GB HDD
   - **Backups**: Enable automated backups
4. Click **Create Instance** (takes ~5-10 minutes)

#### Configure Database Access

1. Once created, click on your instance
2. Go to **Connections** > **Networking**
3. Add **Authorized Network**:
   - **Name**: Cloudflare
   - **Network**: `0.0.0.0/0` (allow all, or restrict to Cloudflare IPs)
4. Enable **SSL connections**
5. Note the **Public IP address**

#### Create Database and User

1. Go to **Databases** tab > **Create database**
   - **Database name**: `blacktechnews`
2. Go to **Users** tab > **Add user account**
   - **Username**: `btnuser`
   - **Password**: Set a strong password
   - **Built-in authentication**: Yes

#### Run Database Schema

Option A: Using Cloud SQL Proxy (Recommended for local development)

```bash
# Download Cloud SQL Proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.2/cloud-sql-proxy.darwin.amd64
chmod +x cloud-sql-proxy

# Start proxy (replace with your connection name)
./cloud-sql-proxy PROJECT:REGION:INSTANCE

# In another terminal
psql "host=127.0.0.1 port=5432 sslmode=disable user=btnuser dbname=blacktechnews"

# Run schema
\i lib/db/schema.sql
```

Option B: Direct connection

```bash
psql "host=YOUR_PUBLIC_IP port=5432 sslmode=require user=btnuser dbname=blacktechnews"

# Run schema
\i lib/db/schema.sql
```

### Step 2: Local Development with Database

1. **Create `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`**:
   ```env
   DB_HOST=YOUR_CLOUD_SQL_PUBLIC_IP
   DB_PORT=5432
   DB_NAME=blacktechnews
   DB_USER=btnuser
   DB_PASSWORD=YOUR_PASSWORD
   DB_SSL=true
   ```

3. **Test the connection**:
   ```bash
   npm run dev
   ```
   Check console for "Connected to Google Cloud SQL database"

### Step 3: GitHub Repository Setup

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name: `black-tech-news`
   - Visibility: Public or Private
   - Don't initialize with README (we already have one)

2. **Push your code**:
   ```bash
   cd /Users/courtneygreer/Development/black-tech-news
   git init
   git add .
   git commit -m "Initial commit - Black Tech News standalone site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/black-tech-news.git
   git push -u origin main
   ```

### Step 4: Cloudflare Pages Deployment

#### Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** > **Create a project**
3. Click **Connect to Git**
4. Select your GitHub account > Select `black-tech-news` repository
5. Configure build settings:
   - **Project name**: `black-tech-news`
   - **Production branch**: `main`
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
6. Click **Save and Deploy**

#### Add Environment Variables

1. Go to your project > **Settings** > **Environment variables**
2. Add for **Production** environment:
   ```
   DB_HOST = YOUR_CLOUD_SQL_PUBLIC_IP
   DB_PORT = 5432
   DB_NAME = blacktechnews
   DB_USER = btnuser
   DB_PASSWORD = YOUR_PASSWORD
   DB_SSL = true
   ```
3. Click **Save**

#### Redeploy

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment > **Retry deployment**
3. Wait for build to complete (~2-3 minutes)
4. Your site is live at `black-tech-news.pages.dev`!

### Step 5: Connect Custom Domain (blacktechnews.cc)

#### In Cloudflare Pages

1. Go to your project > **Custom domains**
2. Click **Set up a custom domain**
3. Enter `blacktechnews.cc`
4. Click **Continue**
5. Cloudflare will show you DNS records to add

#### At Your Domain Registrar (Google Domains, Namecheap, etc.)

**If your domain is already on Cloudflare:**
1. DNS records will be automatically added
2. Domain should be active within minutes

**If your domain is elsewhere:**
1. Go to your domain registrar's DNS settings
2. Add these records:

   For root domain (blacktechnews.cc):
   ```
   Type: CNAME (or ALIAS/ANAME)
   Name: @ (or leave blank)
   Value: black-tech-news.pages.dev
   ```

   For www subdomain:
   ```
   Type: CNAME
   Name: www
   Value: black-tech-news.pages.dev
   ```

3. Save and wait for DNS propagation (5 minutes to 48 hours)

#### Verify Domain

1. Visit https://blacktechnews.cc
2. Verify SSL certificate is active (should be automatic)
3. Test all pages and functionality

### Step 6: Optional - Transfer Domain to Cloudflare

Benefits:
- Free SSL
- Better performance
- Easier DNS management
- Free email forwarding

Steps:
1. Go to Cloudflare Dashboard > **Add a site**
2. Enter `blacktechnews.cc`
3. Select **Free plan**
4. Cloudflare will scan your DNS records
5. Update nameservers at your registrar
6. Wait for activation (usually 24 hours)

## Testing Checklist

- [ ] Local development works (`npm run dev`)
- [ ] Database connection successful
- [ ] Articles load from RSS feeds
- [ ] Articles save to database
- [ ] Build completes without errors (`npm run build`)
- [ ] Cloudflare deployment successful
- [ ] Custom domain loads correctly
- [ ] SSL certificate is active
- [ ] All links work
- [ ] Mobile responsive
- [ ] Social media sharing works

## Troubleshooting

### Database Connection Fails

**Error**: `Connection refused`
- Check Cloud SQL instance is running
- Verify authorized networks include your IP
- Check credentials in `.env.local`

**Error**: `SSL connection required`
- Add `DB_SSL=true` to environment variables
- Verify SSL is enabled on Cloud SQL instance

### Build Fails on Cloudflare

**Error**: `Module not found`
- Check all imports use correct paths
- Verify `package.json` dependencies are complete
- Clear Cloudflare build cache and retry

**Error**: `Environment variable undefined`
- Add all DB_ variables in Cloudflare Pages settings
- Redeploy after adding variables

### Articles Not Loading

- Check browser console for errors
- Verify RSS feed URLs are still valid
- Check CORS proxy is working
- Try different news sources

### Domain Not Loading

- Check DNS propagation: https://dnschecker.org
- Verify CNAME records are correct
- Wait up to 48 hours for full propagation
- Clear browser cache

## Maintenance

### Daily
- Monitor article fetching (check logs)
- Verify site is loading correctly

### Weekly
- Review database size
- Check for failed RSS feeds
- Update news sources if needed

### Monthly
- Review Google Cloud costs
- Update dependencies (`npm update`)
- Backup database
- Review analytics

## Costs

### Expected Monthly Costs

**Google Cloud SQL**
- db-f1-micro: $7-8/month
- db-g1-small: $25-27/month
- Storage (10GB): $0.17/month
- Backups (7 days): $0.08/month

**Cloudflare Pages**
- Free tier: $0/month
- Unlimited requests
- 500 builds/month (more than enough)

**Domain (blacktechnews.cc)**
- ~$12/year (varies by registrar)

**Total**: ~$8-28/month depending on database tier

## Security Best Practices

1. **Never commit `.env` files**
   - Always use `.env.example` for templates
   - Add `.env*` to `.gitignore`

2. **Use strong passwords**
   - Database password: 16+ characters
   - Mix uppercase, lowercase, numbers, symbols

3. **Restrict database access**
   - Use specific IP ranges instead of 0.0.0.0/0
   - Enable SSL connections only

4. **Regular updates**
   - Update npm packages monthly
   - Apply security patches immediately

5. **Monitor access**
   - Review Cloudflare analytics
   - Check Google Cloud logs

## Next Steps

Once deployed, consider:

1. **Add more news sources**
   - Find RSS feeds from more Black tech publications
   - Add web scraping for sites without RSS

2. **Implement article search**
   - Add PostgreSQL full-text search
   - Create search API endpoint

3. **User accounts (optional)**
   - Bookmark favorite articles
   - Email newsletter subscriptions
   - Personalized feeds

4. **Automated article fetching**
   - Create Cloud Function to fetch articles hourly
   - Set up cron job for regular updates

5. **Analytics**
   - Add Google Analytics or Mixpanel
   - Track popular articles
   - Monitor user engagement

6. **Social features**
   - Share to Twitter/LinkedIn
   - Social media meta tags
   - Open Graph images

## Support

Need help? Contact:
- **Email**: hello@wolfdevelopmentstudio.com
- **Website**: https://www.wolfdevelopmentstudio.com

## License

© 2025 Black Tech News. All rights reserved.
