# ⚠️ IMPORTANT: Environment Variables Not Set
# 
# The frontend needs environment variables configured on Vercel:
#
# 1. Go to: https://vercel.com/mansatomansa4s-projects/your-project-name/settings/environment-variables
# 2. Add this variable:
#
#    Name: NEXT_PUBLIC_API_URL
#    Value: https://mansa-backend-1rr8.onrender.com
#
# 3. Redeploy the frontend
#
# Without this, API calls will fail with 404 errors because the base URL is undefined.

# For local development, create .env.local with:
NEXT_PUBLIC_API_URL=https://mansa-backend-1rr8.onrender.com
