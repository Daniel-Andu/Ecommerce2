# 🚀 Cloudinary Migration Guide - Fix Product Images Permanently

## Problem
Render's free tier deletes uploaded images when the container restarts. This is why your product images disappear after 20-30 minutes.

## Solution
Use Cloudinary (free tier) for permanent image storage.

---

## Step 1: Sign Up for Cloudinary (5 minutes)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up (free account gives you 25GB storage)
3. After signup, go to Dashboard
4. Copy these credentials:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 2: Add Cloudinary to Backend (2 minutes)

### Install Dependencies

```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

### Add Environment Variables

Add these to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**IMPORTANT:** Also add these to Render's environment variables:
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Go to "Environment" tab
4. Add the 3 Cloudinary variables

---

## Step 3: Update Backend Code

The `backend/config/cloudinary.js` file has been created for you.

Now you need to update your routes to use Cloudinary storage instead of local storage.

### Update Product Upload Route

In `backend/routes/seller.js`, find the multer configuration and replace it:

**OLD:**
```javascript
const upload = multer({ 
  storage: multer.diskStorage({
    destination: './uploads/products',
    filename: (req, file, cb) => {
      cb(null, 'images-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

**NEW:**
```javascript
const { productStorage } = require('../config/cloudinary');

const upload = multer({ 
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

### Update Image URL Handling

When saving product images, Cloudinary automatically provides the URL:

**In your product creation route:**
```javascript
// OLD way (local storage)
const image_url = `${baseUrl}/uploads/products/${req.file.filename}`;

// NEW way (Cloudinary)
const image_url = req.file.path; // Cloudinary provides full URL
```

---

## Step 4: Update Profile Image Upload

In `backend/routes/auth.js` or wherever profile uploads are handled:

```javascript
const { profileStorage } = require('../config/cloudinary');

const profileUpload = multer({ 
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});
```

---

## Step 5: Deploy to Render

1. Commit and push changes:
```bash
git add .
git commit -m "Add Cloudinary for permanent image storage"
git push origin main
```

2. Render will auto-deploy (wait 3-5 minutes)

3. Verify environment variables are set in Render dashboard

---

## Step 6: Test

1. Upload a new product with images
2. Wait 30 minutes
3. Check if images still display ✅

---

## Benefits

✅ Images never disappear  
✅ Automatic image optimization  
✅ CDN delivery (faster loading)  
✅ Free tier: 25GB storage, 25GB bandwidth/month  
✅ Automatic backups  

---

## Alternative: Quick Temporary Fix

If you can't set up Cloudinary right now, you can:

1. Use a paid Render plan with persistent disk storage
2. Store images as base64 in database (NOT recommended for production)
3. Use AWS S3, Google Cloud Storage, or similar

---

## Need Help?

If you encounter issues:
1. Check Render logs for errors
2. Verify Cloudinary credentials are correct
3. Make sure environment variables are set in Render
4. Test locally first before deploying

---

**Status:** Configuration file created ✅  
**Next Step:** Install npm packages and update routes  
**Time Required:** 15-20 minutes total
