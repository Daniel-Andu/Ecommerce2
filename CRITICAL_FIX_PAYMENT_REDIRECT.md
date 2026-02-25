# 🚨 CRITICAL: Fix Payment Redirect

## Issue
After Chapa payment, redirects to admin page instead of order confirmation.

## Solution
Update Render environment variable:

1. Go to: https://dashboard.render.com
2. Click: e-commerce-backend-3i6r
3. Click: Environment tab
4. Update/Add:
   ```
   FRONTEND_URL = https://ecommerce-customer-site.vercel.app
   ```
5. Save Changes
6. Wait for redeploy (2-3 minutes)

## Test
After redeploy, make a test payment. Should redirect to:
`https://ecommerce-customer-site.vercel.app/order-confirmation/[order-id]`

NOT to admin page.
