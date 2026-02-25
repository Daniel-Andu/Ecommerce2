# Deploy Payment Fix - Complete Instructions

## Step 1: Push Code Changes (Adds Debug Endpoint)

Run these commands in your terminal:

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Fix: Add debug endpoint and update payment redirect URLs"

# Push to GitHub
git push origin main
```

This will trigger automatic deployment on Render (takes 2-3 minutes).

## Step 2: Set Environment Variables on Render Dashboard

**IMPORTANT**: While waiting for deployment, set these variables:

1. Go to: https://dashboard.render.com
2. Click your backend service: **e-commerce-backend-3i6r**
3. Click **"Environment"** in left sidebar
4. Add these variables (click "Add Environment Variable" for each):

### Required Variables:

```
FRONTEND_URL
https://e-commerce-marketing.vercel.app
```

```
BACKEND_URL
https://e-commerce-backend-3i6r.onrender.com
```

```
NODE_ENV
production
```

```
JWT_SECRET
h3jdKcCKUTg1lt037JhECSIN
```

```
JWT_EXPIRES_IN
7d
```

```
DB_HOST
gateway01.eu-central-1.prod.aws.tidbcloud.com
```

```
DB_USER
3MQF71BGR4igtWy.root
```

```
DB_PASSWORD
42MeRZKaKyT1Fk1z
```

```
DB_NAME
test
```

```
DB_PORT
4000
```

```
CHAPA_PUBLIC_KEY
CHAPUBK_TEST-LlA4GnzuplVZy51qlRWfRssXp1wFZd6E
```

```
CHAPA_SECRET_KEY
CHASECK_TEST-cKt0OatPOMJK2T1BXvWHX6FzKUyBYJeH
```

```
CHAPA_API_URL
https://api.chapa.co/v1
```

5. Click **"Save Changes"**
6. Render will redeploy automatically

## Step 3: Wait for Deployment

Wait for both deployments to complete:
- ✅ Code push deployment (from Step 1)
- ✅ Environment variable deployment (from Step 2)

Check Render logs for: **"Your service is live 🎉"**

## Step 4: Verify Environment Variables

After deployment completes, open this URL:

```
https://e-commerce-backend-3i6r.onrender.com/api/payment/debug-env
```

You should see:
```json
{
  "FRONTEND_URL": "https://e-commerce-marketing.vercel.app",
  "BACKEND_URL": "https://e-commerce-backend-3i6r.onrender.com",
  "NODE_ENV": "production",
  "CHAPA_SECRET_KEY": "SET"
}
```

If you see "NOT SET" or wrong values, go back to Step 2.

## Step 5: Test Payment Flow

1. Go to: https://e-commerce-marketing.vercel.app
2. Add product to cart
3. Go to checkout
4. Fill shipping address
5. Select "Chapa Payment"
6. Click "Place Order"
7. Complete payment on Chapa
8. ✅ Should redirect to: `https://e-commerce-marketing.vercel.app/order-confirmation/[order-id]`

## Troubleshooting

### If debug endpoint still shows 404:
- Wait a few more minutes for deployment
- Check Render logs to confirm deployment completed
- Try hard refresh: Ctrl+Shift+R

### If environment variables show wrong values:
- Double-check you entered them correctly in Render dashboard
- Make sure there are no extra spaces
- Click "Save Changes" again
- Wait for redeploy

### If payment still redirects to admin:
- Check debug endpoint shows correct FRONTEND_URL
- Clear browser cache
- Try in incognito/private window
- Check Render logs during payment for "Return URL:" message

## Quick Checklist

- [ ] Pushed code changes to GitHub
- [ ] Set FRONTEND_URL in Render dashboard
- [ ] Set BACKEND_URL in Render dashboard  
- [ ] Set all other required variables
- [ ] Clicked "Save Changes"
- [ ] Waited for deployment (check logs)
- [ ] Verified debug endpoint shows correct values
- [ ] Tested payment flow
- [ ] Payment redirects to order confirmation ✅

## Important Notes

1. **Both steps are required**:
   - Step 1: Adds debug endpoint to code
   - Step 2: Sets environment variables

2. **Order matters**:
   - Do Step 1 first (push code)
   - Then do Step 2 (set variables)
   - Both trigger redeployment

3. **Wait for completion**:
   - Each deployment takes 2-3 minutes
   - Check "Logs" tab on Render
   - Look for "Your service is live 🎉"

4. **Environment variables persist**:
   - Once set in dashboard, they stay
   - No need to set them again
   - Only update if values change

---

## Summary

The fix requires TWO things:
1. ✅ Code changes (debug endpoint) - Push to GitHub
2. ✅ Environment variables - Set in Render dashboard

Both must be done for the fix to work!
