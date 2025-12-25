# Production Deployment Guide

## Problem
When accessing okanacer.xyz, the app tries to connect to `localhost:8080` instead of the production API at `https://api.okanacer.xyz`.

## Root Cause
Next.js only loads `.env.production` when built with `NODE_ENV=production`. Without this, it falls back to the hardcoded default in the code.

## Solution: Rebuild for Production

### Step 1: Build Dashboard with Production Environment

```bash
cd apps/dashboard

# Clean previous build
rm -rf .next

# Build with production environment
NODE_ENV=production npm run build
```

This ensures Next.js loads `.env.production` which contains:
```
NEXT_PUBLIC_API_URL=https://api.okanacer.xyz/api
```

### Step 2: Deploy to Production

After building, deploy the `.next` folder to your production server (okanacer.xyz).

**If using a deployment platform (Vercel, Netlify, etc.):**
- Make sure environment variables are set in the platform dashboard
- Set `NEXT_PUBLIC_API_URL=https://api.okanacer.xyz/api`

**If self-hosting:**
```bash
# Copy the built files to your server
scp -r .next/ your-server:/path/to/okanacer.xyz/

# On server, start with production mode
NODE_ENV=production npm start
```

### Step 3: Verify

1. Visit `https://okanacer.xyz`
2. Open browser DevTools > Network tab
3. Click "Login with Google"
4. Verify the redirect goes to `https://api.okanacer.xyz/api/auth/login/google`
   - **NOT** `localhost:8080`

## Alternative: Set Environment Variables at Build Time

If you're using a CI/CD pipeline or deployment platform:

**Vercel:**
- Go to Project Settings > Environment Variables
- Add: `NEXT_PUBLIC_API_URL` = `https://api.okanacer.xyz/api`
- Environment: Production
- Redeploy

**Docker:**
```dockerfile
# In your Dockerfile
ARG NEXT_PUBLIC_API_URL=https://api.okanacer.xyz/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build
```

**GitHub Actions / CI:**
```yaml
- name: Build
  env:
    NEXT_PUBLIC_API_URL: https://api.okanacer.xyz/api
  run: npm run build
```

## Why This Happens

Next.js environment variable priority:
1. **Runtime** environment variables (server-side only)
2. **`.env.production`** (when `NODE_ENV=production`)
3. **`.env.local`** (gitignored, local development)
4. **Code defaults** (fallback in `dashboardApi.ts`)

Since the production build wasn't using `NODE_ENV=production`, it skipped `.env.production` and used the code's fallback value: `http://localhost:8080/api`.

## Quick Test (Local)

To test production build locally:

```bash
cd apps/dashboard

# Build for production
NODE_ENV=production npm run build

# Start production server
NODE_ENV=production npm start

# Visit http://localhost:3000
# Should connect to https://api.okanacer.xyz/api (not localhost:8080)
```

## Files Referenced

- [.env.production](file:///home/acrtech/Documents/GitHub/olric/apps/dashboard/.env.production) - Production environment config
- [dashboardApi.ts](file:///home/acrtech/Documents/GitHub/olric/apps/dashboard/app/lib/api/dashboardApi.ts#L5) - API URL configuration
