# MentorHub Deployment Guide

This guide walks through deploying the MentorHub platform to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] Vercel account (for frontend hosting)
- [ ] Backend hosting account (AWS, DigitalOcean, Render, etc.)
- [ ] PostgreSQL database (Supabase, Neon, or self-hosted)
- [ ] Domain name with DNS access
- [ ] Sentry account (for error tracking)
- [ ] Google Analytics account (optional)

### Required Tools
- Node.js 18+ and npm
- Git
- Python 3.11+ (for backend)
- PostgreSQL client tools

---

## Environment Setup

### 1. Create Environment Files

**Frontend (.env.production):**
```bash
# Copy example file
cp .env.production.example .env.production

# Edit with production values
nano .env.production
```

Required variables:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking DSN
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Analytics ID

**Backend (.env):**
See `mansa-backend/DEPLOYMENT.md` for backend-specific configuration.

### 2. Verify Configuration

```bash
# Check all required variables are set
npm run check-env

# Test API connectivity
curl $NEXT_PUBLIC_API_URL/api/v1/health/
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Configure Project**
```bash
cd mansa-redesign
vercel
```

Follow prompts:
- Set project name: `mansa-mentorhub`
- Framework preset: `Next.js`
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `.next`

**Step 4: Add Environment Variables**

Via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production`
3. Set scope to "Production"

Via CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_SENTRY_DSN production
```

**Step 5: Deploy to Production**
```bash
vercel --prod
```

**Step 6: Configure Custom Domain**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Enable automatic SSL certificate

### Option 2: Self-Hosted

**Step 1: Build for Production**
```bash
npm install
npm run build
```

**Step 2: Start Production Server**
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start npm --name "mentorhub" -- start
pm2 save
pm2 startup
```

**Step 3: Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Step 4: Enable SSL with Certbot**
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Backend Deployment

### Prerequisites
- Python 3.11+ installed
- PostgreSQL database configured
- Environment variables set

### Step 1: Prepare Backend

Navigate to backend directory:
```bash
cd mansa-backend
```

### Step 2: Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Run Migrations
```bash
python manage.py migrate
python manage.py collectstatic --no-input
```

### Step 4: Create Superuser
```bash
python manage.py createsuperuser
```

### Step 5: Deploy Backend

**Using Render.com:**
1. Connect GitHub repository
2. Select `mansa-backend` directory
3. Build command: `./build.sh`
4. Start command: `gunicorn config.wsgi:application`
5. Add environment variables from backend `.env`

**Using AWS EC2:**
```bash
# On your EC2 instance
git clone your-repo.git
cd mansa-backend
./build.sh
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

**Using Docker:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Step 6: Configure CORS

Update backend `settings/production.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

---

## Database Setup

### Option 1: Supabase (Recommended)

**Step 1: Create Project**
1. Go to https://supabase.com
2. Create new project
3. Copy database connection string

**Step 2: Run Migrations**
```bash
# Set DATABASE_URL in backend .env
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres

# Run migrations
python manage.py migrate
```

**Step 3: Load Initial Data**
```bash
# Load mentorship categories
python manage.py loaddata fixtures/expertise_categories.json

# Optional: Load sample data
python manage.py loaddata fixtures/sample_mentors.json
```

### Option 2: Self-Hosted PostgreSQL

**Step 1: Install PostgreSQL**
```bash
sudo apt-get install postgresql postgresql-contrib
```

**Step 2: Create Database**
```bash
sudo -u postgres psql
CREATE DATABASE mentorhub;
CREATE USER mentorhub_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mentorhub TO mentorhub_user;
\q
```

**Step 3: Configure Backup**
```bash
# Add to crontab (daily backup at 2 AM)
0 2 * * * pg_dump mentorhub > /backups/mentorhub_$(date +\%Y\%m\%d).sql
```

---

## Post-Deployment

### 1. Verify Deployment

**Frontend Health Check:**
```bash
curl https://yourdomain.com
# Should return 200 OK
```

**Backend Health Check:**
```bash
curl https://api.yourdomain.com/api/v1/health/
# Should return {"status": "healthy"}
```

**Test Authentication:**
```bash
# Login test
curl -X POST https://api.yourdomain.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

### 2. Performance Testing

**Lighthouse Audit:**
```bash
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

**Load Testing:**
```bash
npm install -g artillery
artillery quick --count 100 --num 10 https://yourdomain.com
```

### 3. Security Checklist

- [ ] SSL/HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] Database backups automated
- [ ] Security headers configured
- [ ] API authentication working
- [ ] Admin panel access restricted

### 4. SEO Configuration

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```

**sitemap.xml:**
Generated automatically by Next.js. Verify at:
`https://yourdomain.com/sitemap.xml`

---

## Monitoring

### 1. Error Tracking with Sentry

**Install Sentry SDK:**
```bash
npm install @sentry/nextjs
```

**Configure Sentry:**
```bash
npx @sentry/wizard@latest -i nextjs
```

**Verify Integration:**
```bash
# Trigger test error
curl https://yourdomain.com/api/sentry-test
```

### 2. Analytics Setup

**Google Analytics:**
Add to `_app.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

**Custom Events:**
```typescript
import { trackEvent } from '@/lib/analytics'

trackEvent('mentor_booking', { mentor_id: mentorId })
```

### 3. Uptime Monitoring

**Using UptimeRobot:**
1. Create account at https://uptimerobot.com
2. Add HTTP(s) monitor for your domain
3. Set check interval to 5 minutes
4. Configure email/SMS alerts

**Monitoring Endpoints:**
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com/api/v1/health/`
- Database: Custom health check endpoint

---

## Troubleshooting

### Common Issues

**Issue: White screen on deployment**
```bash
# Check build logs
vercel logs

# Verify environment variables
vercel env ls

# Test build locally
npm run build
npm start
```

**Issue: API connection failed**
```bash
# Verify CORS settings in backend
# Check NEXT_PUBLIC_API_URL is correct
# Test API directly
curl -I https://api.yourdomain.com
```

**Issue: Database connection error**
```bash
# Check DATABASE_URL format
# Verify PostgreSQL is running
# Check firewall rules allow connections
# Test connection
psql $DATABASE_URL
```

**Issue: Slow page loads**
```bash
# Enable compression in next.config.js
# Optimize images with next/image
# Check CDN configuration
# Review Lighthouse performance report
```

### Debug Mode

Enable debug logging temporarily:
```bash
# Frontend
NEXT_PUBLIC_DEBUG=true npm run build

# Backend
DEBUG=True python manage.py runserver
```

### Rollback Procedure

**Frontend (Vercel):**
```bash
# List deployments
vercel ls

# Rollback to previous version
vercel rollback [deployment-url]
```

**Backend:**
```bash
# Using Git
git revert HEAD
git push origin main

# Or restore from backup
pg_restore -d mentorhub backup_file.sql
```

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor error rates in Sentry
- Check uptime monitoring alerts
- Review analytics for anomalies

**Weekly:**
- Review performance metrics
- Check database size and growth
- Test backup restoration

**Monthly:**
- Update dependencies
- Security audit
- Review and rotate API keys
- Performance optimization review

### Emergency Contacts

- **DevOps Lead:** devops@company.com
- **Backend Team:** backend@company.com
- **Frontend Team:** frontend@company.com
- **On-Call Rotation:** oncall@company.com

### Useful Commands

```bash
# View production logs (Vercel)
vercel logs --follow

# Check build status
vercel inspect [deployment-url]

# Run production build locally
npm run build && npm start

# Database backup
pg_dump $DATABASE_URL > backup.sql

# Database restore
psql $DATABASE_URL < backup.sql
```

---

## Next Steps

After successful deployment:
1. ✅ Train admin users (see USER_GUIDE.md)
2. ✅ Configure email notifications
3. ✅ Setup regular security audits
4. ✅ Plan feature rollout strategy
5. ✅ Gather user feedback

For detailed backend deployment, see `mansa-backend/DEPLOYMENT.md`
