# Black Tech News - Monitoring & Alerting Guide

## Overview

This document describes the monitoring infrastructure for blacktechnews.com to ensure you're alerted immediately when something breaks.

## 🏥 Health Check Endpoint

**URL:** `https://blacktechnews.com/health`

**What it checks:**
- ✅ Site is responding
- ✅ Wolf Studio API is accessible
- ✅ Articles can be fetched
- ✅ Response time metrics

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T12:00:00.000Z",
  "checks": {
    "site": "ok",
    "api": "ok",
    "articles": "ok"
  },
  "metrics": {
    "responseTime": "234ms",
    "articlesAvailable": 50
  }
}
```

## 🔔 Automated Alerts (GitHub Actions)

### What's Set Up:
- ✅ **Checks every 5 minutes** via GitHub Actions
- ✅ **Auto-creates GitHub issue** when site goes down
- ✅ **Auto-closes issue** when site recovers
- ✅ **Issue notifications** sent to your GitHub email

### How to Get Alerts:
1. **Watch the repository:**
   - Go to https://github.com/courtneygreer-voxxy/black-tech-news
   - Click "Watch" → "All Activity"
   - You'll get emails when issues are created

2. **Enable GitHub notifications:**
   - Settings → Notifications
   - Enable "Email" for "Issues"

### Manual Check:
You can manually trigger the health check workflow:
1. Go to Actions tab
2. Select "Uptime Check & Alert"
3. Click "Run workflow"

## 🌐 External Monitoring (Recommended)

For instant SMS/Slack alerts, set up one of these services:

### Option 1: Better Uptime (Free, Recommended)
- **URL:** https://betteruptime.com
- **Price:** Free for 1 monitor
- **Setup:**
  1. Sign up at betteruptime.com
  2. Add monitor: `https://blacktechnews.com/health`
  3. Set check interval: 1-3 minutes
  4. Add your phone number for SMS alerts
  5. Add Slack/Discord webhook (optional)

### Option 2: UptimeRobot (Free)
- **URL:** https://uptimerobot.com
- **Price:** Free for 50 monitors
- **Setup:**
  1. Sign up at uptimerobot.com
  2. Add New Monitor → HTTP(s)
  3. URL: `https://blacktechnews.com/health`
  4. Keyword to look for: `"healthy"`
  5. Check interval: 5 minutes (free tier)
  6. Add alert contacts (email, SMS, Slack, etc.)

### Option 3: Pingdom (Paid)
- **URL:** https://www.pingdom.com
- **Price:** $10/month for 10 monitors
- **Best for:** Advanced reporting and analytics

## 📊 Monitoring Checklist

Set up these monitors:

| Monitor | URL | Alert When | Priority |
|---------|-----|------------|----------|
| **Homepage** | https://blacktechnews.com | Returns != 200 | 🔴 Critical |
| **Health Check** | https://blacktechnews.com/health | Status != "healthy" | 🔴 Critical |
| **Articles Load** | https://blacktechnews.com (check for text "Black Tech News") | Text not found | 🟡 High |
| **Wolf API** | https://wolf-development-studio.vercel.app/api/articles/list?limit=1 | Returns != 200 | 🟡 High |

## 🚨 Alert Channels

Configure multiple channels so you don't miss anything:

1. **Email** ✉️
   - Already set up via GitHub Issues
   - Check spam folder if not receiving

2. **SMS** 📱
   - Set up via Better Uptime (free)
   - Instant alerts even when offline

3. **Slack/Discord** 💬
   - Get notifications in your workspace
   - Set up via webhook URL

4. **Push Notifications** 📲
   - Better Uptime mobile app
   - UptimeRobot mobile app

## 🔍 What to Check When Alerted

1. **Visit the health check:**
   ```bash
   curl https://blacktechnews.com/health | jq
   ```

2. **Check Cloudflare status:**
   - https://dash.cloudflare.com
   - Look for failed deployments

3. **Check GitHub Actions:**
   - https://github.com/courtneygreer-voxxy/black-tech-news/actions
   - Look for failed builds

4. **Check Wolf API:**
   ```bash
   curl https://wolf-development-studio.vercel.app/api/articles/list?limit=1 | jq
   ```

5. **Check recent commits:**
   - Was there a recent deploy?
   - Did it pass build tests?

## 📈 Response Time Monitoring

The health check endpoint includes response time metrics. Set alerts for:
- ⚠️ **Warning:** > 2 seconds
- 🔴 **Critical:** > 5 seconds

## 🔧 Troubleshooting Common Issues

### Issue: "API returned invalid data"
**Cause:** Wolf Studio API is down or returning errors
**Fix:** Check https://wolf-development-studio.vercel.app/api/articles/list?limit=1

### Issue: "Site returned HTTP 503"
**Cause:** Cloudflare Pages deployment failed or site is overloaded
**Fix:** Check Cloudflare dashboard, redeploy if needed

### Issue: "Response timeout"
**Cause:** API taking too long to respond
**Fix:** Check API health, may need to increase timeout or optimize queries

## 📞 Emergency Contacts

Keep these handy:
- Cloudflare Support: https://support.cloudflare.com
- Vercel Support (for Wolf API): https://vercel.com/support
- GitHub Status: https://www.githubstatus.com

## 🎯 Quick Setup (5 Minutes)

**For immediate monitoring:**

1. **Sign up for Better Uptime** (free)
   - Add `https://blacktechnews.com/health`
   - Add your phone for SMS

2. **Watch GitHub repo**
   - Enable all notifications

3. **Done!** You'll get alerts within minutes of any issues.

## 📱 Mobile Monitoring

Install mobile apps for on-the-go alerts:
- Better Uptime app (iOS/Android)
- UptimeRobot app (iOS/Android)
- GitHub mobile app (for issue notifications)

---

**Questions?** Check the health endpoint status anytime:
```bash
curl https://blacktechnews.com/health | jq
```
