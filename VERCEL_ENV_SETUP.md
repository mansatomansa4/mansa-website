# Vercel Environment Variable Setup

Your production website (https://www.mansa-to-mansa.org) needs the backend API URL configured.

## Quick Fix

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: `mansa-redesign` or `mansa-website`
3. Go to **Settings** → **Environment Variables**
4. Add the following variable:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://mansa-backend-1rr8.onrender.com
```

5. **Important:** Select all environments (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** tab
8. Click **⋯** (three dots) on latest deployment
9. Click **Redeploy** to apply the new environment variable

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL
# When prompted, enter: https://mansa-backend-1rr8.onrender.com
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

## Backend Status

✅ Backend CORS fixed - now allows requests from:
- `https://www.mansa-to-mansa.org`
- `https://mansa-to-mansa.org`

Backend will redeploy automatically (takes ~2-3 minutes).

## Testing After Setup

1. Wait for Vercel redeployment (~2 minutes)
2. Wait for Render backend redeployment (~3 minutes)
3. Try signing up again at: https://www.mansa-to-mansa.org/signup
4. Try logging in at: https://www.mansa-to-mansa.org/community/mentorship/auth

## Current Issue

Your production website has `NEXT_PUBLIC_API_URL=undefined` which causes:
- Signup to fail
- Mentorship login to fail
- All backend API calls to fail

After adding the environment variable and redeploying, it will work correctly.
