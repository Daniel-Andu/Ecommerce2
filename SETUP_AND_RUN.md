# 🚀 Complete Setup and Run Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TiDB Cloud database (already configured)

## Quick Start (3 Steps)

### Step 1: Run Database Migrations

```bash
cd backend
node scripts/run-migrations.js
```

This will create all the new tables:
- notifications
- returns & return_images
- refunds
- withdrawals
- shipping_methods
- coupons & coupon_usage
- pages
- product_attributes

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

Backend will run on: http://localhost:5001

### Step 3: Start Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3002

## What's New in This Version

### 1. Authentication & User Management ✅
- **Modern Login Page** with gradient design
- **Modern Register Page** with password strength indicator
- **Modern Profile Page** with image upload and address management

### 2. Notifications System ✅
- In-app notifications
- Unread count badge
- Mark as read/delete functionality
- Real-time updates

### 3. Returns & Refunds ✅
- Customer can request returns
- Upload return images
- Track return status
- Admin approval workflow

### 4. Seller Wallet & Withdrawals ✅
- View available balance
- Request withdrawals
- Track withdrawal history
- Multiple payment methods

### 5. Advanced Search ✅
- Search by keyword
- Filter by category, price range
- Sort by price, rating, newest
- Beautiful results grid

### 6. Reports & Analytics ✅
- Sales trends chart
- Top products performance
- Top sellers ranking
- Export to PDF/Excel

### 7. Additional Features ✅
- Shipping methods management
- Coupons & discounts
- Static pages CMS
- Product variants

## Testing the Application

### Test Authentication

1. **Register a new account:**
   - Go to http://localhost:3002/register
   - Fill in all fields
   - Watch the password strength indicator
   - Submit and login

2. **Login:**
   - Go to http://localhost:3002/login
   - Use your credentials
   - Toggle password visibility
   - Check "Remember me"

3. **Profile Management:**
   - Go to http://localhost:3002/profile
   - Upload a profile image
   - Update your details
   - Change password
   - Add addresses

### Test New Features

1. **Notifications:**
   - Click the bell icon in navbar
   - View notifications
   - Mark as read
   - Delete notifications

2. **Returns:**
   - Go to http://localhost:3002/returns
   - Request a return for an order
   - Upload images
   - Track status

3. **Advanced Search:**
   - Go to http://localhost:3002/search
   - Try different filters
   - Sort results
   - View products

4. **Seller Wallet (if you're a seller):**
   - Go to http://localhost:3002/seller/wallet
   - View balance
   - Request withdrawal
   - Track history

## Admin Panel

The admin panel runs separately:

```bash
cd admin-frontend
npm run dev
```

Admin panel will run on: http://localhost:3001

### Admin Features:
- Dashboard with graphs
- Manage sellers
- Manage products
- Manage categories
- Manage banners
- Manage orders
- View reports & analytics

## Environment Variables

### Backend (.env)
```env
PORT=5001
NODE_ENV=development

# Database
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_jwt_secret

# Chapa Payment
CHAPA_SECRET_KEY=your_chapa_key

# Frontend URL
FRONTEND_URL=http://localhost:3002
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

### Admin Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

**Windows:**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
```

### Database Connection Error

1. Check your `.env` file has correct database credentials
2. Verify TiDB Cloud database is accessible
3. Check if SSL certificate (`ca.pem`) exists in backend folder

### White Page / Blank Screen

1. Check browser console for errors (F12)
2. Verify backend is running on port 5001
3. Check frontend `.env` has correct API URL
4. Clear browser cache and reload

### Import Errors

All import errors have been fixed. The app uses native fetch API instead of axios.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register customer
- `POST /api/auth/register/seller` - Register seller
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/upload-profile-image` - Upload image
- `PUT /api/auth/change-password` - Change password

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Returns
- `GET /api/returns` - List returns
- `POST /api/returns` - Create return request
- `GET /api/returns/:id` - Get return details
- `PUT /api/returns/:id` - Update return status

### Withdrawals
- `GET /api/withdrawals` - List withdrawals
- `POST /api/withdrawals` - Request withdrawal
- `GET /api/withdrawals/balance` - Get available balance

### Search
- `GET /api/search` - Advanced search with filters

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/products` - Product performance
- `GET /api/reports/sellers` - Seller performance

### Coupons
- `GET /api/coupons` - List coupons
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons` - Create coupon (admin)

### Shipping
- `GET /api/shipping/methods` - List shipping methods
- `POST /api/shipping/calculate` - Calculate shipping cost

## Project Structure

```
ecommerce-marketplace/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes (26 files)
│   ├── scripts/         # Database scripts
│   ├── services/        # Notification service
│   ├── uploads/         # Uploaded files
│   └── server.js        # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # All pages (49 files)
│   │   ├── services/    # API service
│   │   └── App.jsx      # Main app component
│   └── package.json
│
└── admin-frontend/
    ├── src/
    │   ├── components/  # Admin components
    │   ├── pages/       # Admin pages
    │   └── App.jsx      # Admin app
    └── package.json
```

## Modern UI Features

All pages now have:
- ✅ Gradient backgrounds
- ✅ Smooth animations
- ✅ Hover effects
- ✅ Loading states
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Error handling
- ✅ Modern card designs
- ✅ Beautiful forms
- ✅ Icon integration

## Performance Tips

1. **Image Optimization:**
   - Profile images are limited to 2MB
   - Product images should be optimized before upload

2. **Database:**
   - Indexes are created on frequently queried columns
   - Pagination is implemented for large datasets

3. **Caching:**
   - Static assets are cached
   - API responses can be cached on frontend

## Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation
- ✅ File upload restrictions
- ✅ Role-based access control

## Next Steps

1. **Run the migrations** (Step 1 above)
2. **Start both servers** (Steps 2 & 3 above)
3. **Test the application** (follow testing guide above)
4. **Customize as needed** (colors, content, features)

## Support

If you encounter any issues:

1. Check the console for errors (browser F12 and terminal)
2. Verify all environment variables are set correctly
3. Ensure database migrations ran successfully
4. Check that all npm packages are installed
5. Restart both frontend and backend servers

---

**Status:** ✅ Ready to Run!

Everything is set up and ready. Just run the 3 steps above and you're good to go! 🚀
