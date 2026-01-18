# Mentorship API Connection Fix

## Problem
The frontend cannot fetch mentors because `NEXT_PUBLIC_API_URL` is `undefined`, causing requests to fail with 404 errors.

## Root Cause
The deployed Next.js application at `mansa-to-mansa.org` was built without the `NEXT_PUBLIC_API_URL` environment variable, or the environment variable is not configured in the deployment platform.

## Solutions

### For Local Development

1. **Verify `.env.local` exists** with the correct API URL:
   ```bash
   cd c:\Users\USER\OneDrive\Desktop\mansa-redesign
   cat .env.local
   ```
   
   Should contain:
   ```
   NEXT_PUBLIC_API_URL=https://mansa-backend-1rr8.onrender.com
   ```

2. **Stop any running dev servers** (Ctrl+C in the terminal)

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. **Access locally**: http://localhost:3000/community/mentorship

### For Vercel Deployment (Production)

The site `mansa-to-mansa.org` is deployed on Vercel. You need to add the environment variable there:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Select your project** (mansa-redesign or similar)

3. **Go to Settings → Environment Variables**

4. **Add the following variable**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://mansa-backend-1rr8.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)

5. **Redeploy the application**:
   - Go to the Deployments tab
   - Click "⋯" menu on the latest deployment
   - Click "Redeploy"
   - OR: Push a commit to trigger automatic deployment

### Verify the Backend is Working

Test the backend mentorship endpoints directly:

```bash
# Test mentors endpoint
curl "https://mansa-backend-1rr8.onrender.com/api/v1/mentorship/mentors/?page=1&page_size=12"

# Test expertise endpoint  
curl "https://mansa-backend-1rr8.onrender.com/api/v1/mentorship/expertise/"
```

These should return JSON data, not HTML with 404 errors.

## Expected Behavior After Fix

1. The mentorship page should load mentors from the database
2. Console errors should disappear
3. The mentor cards should display properly
4. Search and filtering should work

## Additional Notes

- **Environment variables** starting with `NEXT_PUBLIC_` are embedded at build time
- Any change to these variables requires a **rebuild** of the Next.js app
- Local `.env.local` is never committed to Git (it's in .gitignore)
- Production environment variables must be set in Vercel dashboard

## Quick Test Command

After fixing, run this in your browser console on the mentorship page:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mentorship/mentors/?page=1&page_size=12`)
  .then(r => r.json())
  .then(d => console.log('Mentors:', d))
  .catch(e => console.error('Error:', e));
```

This should show the API URL and fetch mentors successfully.
