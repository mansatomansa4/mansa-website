# Sentry Origin URLs Configuration

## Required Configuration in Sentry Dashboard

To allow Sentry to accept events from your Mansa applications, you need to configure the **Allowed Domains** in your Sentry project settings.

---

## Step-by-Step Configuration

### 1. Login to Sentry Dashboard
- Go to: https://sentry.io
- Login with your account

### 2. Navigate to Project Settings
- Click on **Projects** in the left sidebar
- Select **mansa-mentorship** project
- Click on **Settings** (gear icon)

### 3. Configure Allowed Domains

Go to **Settings → Client Keys (DSN)** → Click on your DSN → **Configure**

Or navigate directly to:
```
https://sentry.io/settings/mansa/projects/mansa-mentorship/keys/
```

### 4. Add Origin URLs

In the **Allowed Domains** section, add the following origins:

#### Production URLs:
```
https://mansa-to-mansa.org
https://www.mansa-to-mansa.org
https://dashboard.mansa-to-mansa.org
https://mansa-redesign.vercel.app
https://mansa-dashboard.vercel.app
```

#### Development URLs (for testing):
```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

#### Staging URLs (if applicable):
```
https://staging.mansa-to-mansa.org
https://preview.mansa-redesign.vercel.app
```

---

## Alternative: Configure via Sentry Settings UI

### Method 1: Project Settings
1. **Sentry Dashboard** → **Projects** → **mansa-mentorship**
2. **Settings** → **Security & Privacy**
3. **Allowed Domains** section
4. Add each origin URL (one per line)

### Method 2: Client Keys Configuration
1. **Settings** → **Projects** → **mansa-mentorship**
2. **Client Keys (DSN)**
3. Click on your DSN key
4. Scroll to **Allowed Domains**
5. Add origin URLs

---

## Origin URL Format

### ✅ Correct Format:
```
https://mansa-to-mansa.org
http://localhost:3000
```

### ❌ Incorrect Format:
```
https://mansa-to-mansa.org/          # No trailing slash
https://mansa-to-mansa.org/path      # No paths
mansa-to-mansa.org                   # Must include protocol
*.mansa-to-mansa.org                 # Wildcards not supported
```

---

## Complete List of Origins to Add

Copy and paste these into Sentry (one per line):

```
https://mansa-to-mansa.org
https://www.mansa-to-mansa.org
https://dashboard.mansa-to-mansa.org
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

If you're using Vercel preview deployments:
```
https://*.vercel.app
```

---

## Verify Configuration

### 1. Check Current Settings
```bash
# Visit Sentry project settings
https://sentry.io/settings/mansa/projects/mansa-mentorship/keys/
```

### 2. Test Event Sending
```bash
# Visit your test page
http://localhost:3000/sentry-test

# Click "Test Error Capture"
# Check browser console for any CORS errors
```

### 3. Expected Behavior
- ✅ Events appear in Sentry dashboard within 5-10 seconds
- ✅ No CORS errors in browser console
- ✅ Source maps uploaded and working

---

## Additional Security Settings

### Rate Limiting
**Recommended Settings**:
- **Per Project**: 10,000 events/minute
- **Per Key**: 1,000 events/minute
- **Per IP**: 100 events/minute

### Data Scrubbing
Ensure these are enabled:
- ✅ **Scrub IP Addresses**
- ✅ **Scrub Sensitive Data** (passwords, credit cards)
- ✅ **Scrub Default Fields** (email, username)

---

## Environment-Specific Configuration

### Development (localhost)
```javascript
// sentry.client.config.ts
beforeSend(event, hint) {
  // Filter out localhost errors in production builds
  if (process.env.NODE_ENV === 'development') {
    return null; // Don't send to Sentry
  }
  return event;
}
```

### Production
```javascript
// All errors sent to Sentry
// Sample rate: 10% for performance
// 100% for errors
```

---

## Troubleshooting

### Issue: CORS Error in Browser Console
```
Access to fetch at 'https://o4510765336166400.ingest.us.sentry.io/...'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
1. Add `http://localhost:3000` to Allowed Domains in Sentry
2. Wait 1-2 minutes for changes to propagate
3. Clear browser cache and reload

### Issue: Events Not Appearing
**Check**:
1. ✅ DSN configured correctly in `.env.local`
2. ✅ Origin URL added to Sentry allowed domains
3. ✅ Not in development mode (dev mode filters events)
4. ✅ Browser console shows no errors

**Debug**:
```javascript
// In browser console
console.log(process.env.NEXT_PUBLIC_SENTRY_DSN)
// Should output your DSN

// Check Sentry initialization
window.__SENTRY__
// Should be defined
```

### Issue: Source Maps Not Working
**Solution**:
```bash
# Ensure auth token is set
export SENTRY_AUTH_TOKEN=your_auth_token

# Rebuild with source maps
npm run build

# Verify upload in Sentry
https://sentry.io/settings/mansa/projects/mansa-mentorship/source-maps/
```

---

## Quick Copy-Paste for Sentry Dashboard

### Production + Development Origins:
```
https://mansa-to-mansa.org
https://www.mansa-to-mansa.org
https://dashboard.mansa-to-mansa.org
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

### Additional Vercel Deployments:
```
https://mansa-redesign.vercel.app
https://mansa-dashboard.vercel.app
https://mansa-redesign-git-main.vercel.app
https://mansa-redesign-*.vercel.app
```

---

## Testing Checklist

After configuring origins, test:

- [ ] Visit http://localhost:3000/sentry-test
- [ ] Click "Test Error Capture"
- [ ] Check browser DevTools Console (no CORS errors)
- [ ] Visit https://sentry.io/organizations/mansa/issues/
- [ ] Verify error appears within 10 seconds
- [ ] Click on error to see stack trace
- [ ] Verify source maps show correct line numbers

---

## Next Steps

1. ✅ Add origin URLs to Sentry (copy list above)
2. ✅ Test at http://localhost:3000/sentry-test
3. ✅ Verify events in Sentry dashboard
4. ✅ Set up alerts for production errors
5. ✅ Configure team notifications (Slack/Email)

---

## Support

If you encounter issues:

1. **Sentry Documentation**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
2. **CORS Documentation**: https://docs.sentry.io/product/security/cors/
3. **Sentry Support**: https://sentry.io/support/

---

**Configuration Complete!** 🎉

Your Sentry project is ready to receive events from all Mansa applications once you add the origin URLs to the Sentry dashboard.
