# Deployment Guide

> Complete guide for deploying Black Tech News to Cloudflare Pages.

**Note**: For local development, see [API Integration](./docs/api-integration.md). Database setup is optional - the site works with the Wolf Studio API alone.

## Prerequisites

- Google Cloud account with billing enabled
- Cloudflare account
- Domain registered (blacktechnews.cc)
- Git repository (GitHub recommended)

## Part 1: Google Cloud SQL Setup

### 1. Create a PostgreSQL Instance

```bash
# Using gcloud CLI (or use the Google Cloud Console)
gcloud sql instances create blacktechnews-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=HDD \
  --storage-size=10GB
```

### 2. Create Database and User

```bash
# Create the database
gcloud sql databases create blacktechnews \
  --instance=blacktechnews-db

# Create a user
gcloud sql users create btnuser \
  --instance=blacktechnews-db \
  --password=YOUR_SECURE_PASSWORD
```

### 3. Get Connection Details

```bash
# Get the public IP address
gcloud sql instances describe blacktechnews-db \
  --format="value(ipAddresses[0].ipAddress)"

# Note these values:
# - IP Address
# - Database name: blacktechnews
# - User: btnuser
# - Password: YOUR_SECURE_PASSWORD
```

### 4. Configure Network Access

For Cloudflare Pages to access your database:

```bash
# Allow connections from anywhere (0.0.0.0/0)
# Or restrict to specific IPs for better security
gcloud sql instances patch blacktechnews-db \
  --authorized-networks=0.0.0.0/0

# Enable SSL
gcloud sql instances patch blacktechnews-db \
  --require-ssl
```

### 5. Run Database Schema

```bash
# Install Cloud SQL Proxy (for local access)
# Download from: https://cloud.google.com/sql/docs/postgres/sql-proxy

# Start the proxy
./cloud-sql-proxy blacktechnews-db:us-central1:blacktechnews-db

# In another terminal, connect and run schema
psql "host=127.0.0.1 port=5432 sslmode=disable user=btnuser dbname=blacktechnews"

# Copy and paste the contents of lib/db/schema.sql
\i lib/db/schema.sql
```

## Part 2: Cloudflare Pages Deployment

### 1. Push Code to GitHub

```bash
cd /Users/courtneygreer/Development/black-tech-news
git init
git add .
git commit -m "Initial commit - Black Tech News"
git remote add origin https://github.com/YOUR_USERNAME/black-tech-news.git
git push -u origin main
```

### 2. Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Pages** > **Create a project**
3. Connect to Git > Select your repository
4. Configure build settings:
   - **Project name**: black-tech-news
   - **Production branch**: main
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`

### 3. Add Environment Variables

In Cloudflare Pages > Settings > Environment Variables, add:

```
DB_HOST=your-cloud-sql-ip
DB_PORT=5432
DB_NAME=blacktechnews
DB_USER=btnuser
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_SSL=true
```

**Important**: Add these for both **Production** and **Preview** environments.

### 4. Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Install dependencies
3. Run `npm run build`
4. Deploy the static site

### 5. Connect Custom Domain (blacktechnews.cc)

1. In Cloudflare Pages, go to your project > **Custom domains**
2. Click **Set up a custom domain**
3. Enter `blacktechnews.cc`
4. Cloudflare will provide DNS records to add

### 6. Update DNS at Your Domain Registrar

Go to where you registered blacktechnews.cc (e.g., Google Domains, Namecheap):

Add these DNS records:
```
Type: CNAME
Name: @ (or blacktechnews.cc)
Value: your-project.pages.dev

Type: CNAME
Name: www
Value: your-project.pages.dev
```

**Note**: If using Google Domains, you may need to use an ALIAS record instead of CNAME for the root domain.

## Part 3: Verification

### Test the Database Connection

1. Check Cloudflare Pages build logs for database connection success
2. Verify articles are being stored:
   ```sql
   SELECT COUNT(*) FROM articles;
   ```

### Test the Live Site

1. Visit https://blacktechnews.cc
2. Check that articles load
3. Verify links work
4. Test on mobile devices

### Monitor Performance

- **Cloudflare Analytics**: Pages > Analytics
- **Google Cloud Monitoring**: SQL > Your Instance > Monitoring

## Part 4: Continuous Deployment

Every time you push to the `main` branch, Cloudflare Pages will automatically:
1. Build your site
2. Deploy to production
3. Update https://blacktechnews.cc

## Troubleshooting

### Database Connection Fails

- Check environment variables are correct
- Verify Cloud SQL instance is running
- Check authorized networks include Cloudflare IPs
- Ensure SSL is properly configured

### Build Fails on Cloudflare

- Check build logs in Cloudflare Dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Articles Not Loading

- Check browser console for errors
- Verify CORS proxies are working
- Check RSS feed URLs are still valid

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` instead
2. **Use strong passwords** for database
3. **Restrict database access** to necessary IPs only
4. **Enable SSL** for all database connections
5. **Rotate credentials** periodically
6. **Use Cloud SQL Auth Proxy** for local development

## Cost Optimization

### Google Cloud SQL
- **db-f1-micro**: ~$7.67/month (shared CPU, 0.6GB RAM)
- **db-g1-small**: ~$26.88/month (shared CPU, 1.7GB RAM)

### Cloudflare Pages
- **Free tier**: Unlimited requests, 500 builds/month
- More than sufficient for this project

## Backup Strategy

### Automated Backups (Google Cloud SQL)

```bash
# Enable automatic backups
gcloud sql instances patch blacktechnews-db \
  --backup-start-time=03:00

# Create manual backup
gcloud sql backups create \
  --instance=blacktechnews-db
```

### Manual Database Export

```bash
# Export database
gcloud sql export sql blacktechnews-db \
  gs://your-bucket/backup-$(date +%Y%m%d).sql \
  --database=blacktechnews
```

## Next Steps

1. Set up monitoring and alerts
2. Configure CDN caching rules
3. Add RSS feed for the site
4. Implement article search
5. Add user accounts (optional)
6. Set up automated news fetching (cron job or Cloud Function)

## Support

For issues, contact Wolf Development Studio at hello@wolfdevelopmentstudio.com

---

*Last updated: January 2026*
