# 🚀 How to Run Your E-Commerce Marketplace

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MySQL installed and running
- ✅ Git installed (optional)

Check versions:
```bash
node -v
npm -v
mysql --version
```

---

## 🎯 Quick Start (5 Steps)

### Step 1: Install Dependencies

Open 3 separate terminals/command prompts:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

**Terminal 3 - Admin Frontend:**
```bash
cd admin-frontend
npm install
npm install recharts
```

---

### Step 2: Setup Database

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ecommerce_marketplace;
exit;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your server
3. Run: `CREATE DATABASE ecommerce_marketplace;`

---

### Step 3: Configure Environment

**Backend Configuration:**
```bash
cd backend
```

Create `.env` file (or edit existing one):
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_marketplace

# JWT
JWT_SECRET=your_secret_key_here_make_it_long_and_random

# Server
PORT=5000
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Chapa Payment (Optional - works in demo mode without this)
CHAPA_SECRET_KEY=your_chapa_key_here
CHAPA_BASE_URL=https://api.chapa.co/v1

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=E-Commerce Marketplace
```

**Frontend Configuration:**
```bash
cd frontend
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

**Admin Frontend Configuration:**
```bash
cd admin-frontend
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4: Run Database Migrations

```bash
cd backend
npm run setup-features
```

This will create all necessary tables.

**If you see errors**, run manually:
```bash
mysql -u root -p ecommerce_marketplace < scripts/migrations.sql
```

---

### Step 5: Start All Services

Open 3 terminals and run:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on: http://localhost:3000

**Terminal 3 - Admin:**
```bash
cd admin-frontend
npm run dev
```
✅ Admin running on: http://localhost:3001

---

## 🎉 Access Your Application

### Customer Frontend
**URL:** http://localhost:3000
- Browse products
- Add to cart
- Place orders
- Track orders

### Admin Dashboard
**URL:** http://localhost:3001
- View analytics & graphs
- Manage sellers
- Manage products
- View orders

### API
**URL:** http://localhost:5000/api
- Test endpoint: http://localhost:5000/api/test

---

## 👤 Create Admin User

After starting the backend, create an admin account:

```bash
cd backend
node scripts/createAdmin.js
```

Follow the prompts to create your admin account.

---

## 🔧 Enable Dashboard Graphs

The admin dashboard has 2 versions:

**Current (Simple):** `admin-frontend/src/pages/Dashboard.jsx`
**With Graphs:** `admin-frontend/src/pages/DashboardWithGraphs.jsx`

To enable graphs:

**Option 1: Replace the file**
```bash
cd admin-frontend/src/pages
mv Dashboard.jsx Dashboard.backup.jsx
mv DashboardWithGraphs.jsx Dashboard.jsx
```

**Option 2: Manual edit**
Open `admin-frontend/src/App.jsx` and change the import:
```javascript
// Change from:
import Dashboard from './pages/Dashboard';

// To:
import Dashboard from './pages/DashboardWithGraphs';
```

Then restart admin frontend:
```bash
cd admin-frontend
npm run dev
```

---

## 🧪 Test the Application

### 1. Test Backend
```bash
# Open browser or use curl
curl http://localhost:5000/api/test
```

Should return: `{"message": "API is working!"}`

### 2. Register as Customer
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in details
4. Login

### 3. Register as Seller
1. Go to http://localhost:3000
2. Click "Become a Seller"
3. Fill in business details
4. Wait for admin approval

### 4. Login as Admin
1. Go to http://localhost:3001
2. Use admin credentials
3. Approve sellers
4. View dashboard graphs

---

## 🐛 Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Issue 2: Database Connection Error

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
1. Check MySQL is running
2. Verify credentials in `backend/.env`
3. Test connection:
```bash
mysql -u root -p
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'recharts'`

**Solution:**
```bash
cd admin-frontend
npm install recharts
```

### Issue 4: CORS Error

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Already configured in `backend/server.js`. Make sure:
- Backend is running on port 5000
- Frontend URLs match in `.env`

### Issue 5: Migrations Failed

**Error:** `Table already exists`

**Solution:**
This is normal if tables exist. The script skips existing tables.

To reset database:
```bash
mysql -u root -p
DROP DATABASE ecommerce_marketplace;
CREATE DATABASE ecommerce_marketplace;
exit;

cd backend
npm run setup-features
```

---

## 📊 View Dashboard Graphs

After enabling graphs:

1. Login as admin
2. Go to Dashboard
3. You'll see 4 interactive charts:
   - Revenue Trend (Area Chart)
   - Orders vs Products (Bar Chart)
   - Category Distribution (Pie Chart)
   - Order Status (Donut Chart)

**Note:** Graphs need data to display. Create some:
- Add products
- Place orders
- Create categories

---

## 💳 Test Chapa Payment

### Demo Mode (No API Key Needed)
1. Add products to cart
2. Proceed to checkout
3. Place order
4. Payment will auto-complete in 3 seconds
5. View order confirmation

### Production Mode (With Chapa API Key)
1. Get API key from https://chapa.co
2. Add to `backend/.env`:
```env
CHAPA_SECRET_KEY=your_actual_key_here
```
3. Restart backend
4. Test real payment flow

---

## 📱 Test Responsive Design

### Desktop
- Open http://localhost:3000
- Resize browser window
- Check layout adapts

### Mobile Simulation
1. Open Chrome DevTools (F12)
2. Click device toolbar icon
3. Select mobile device
4. Test navigation and features

---

## 🔄 Restart Services

If you make changes:

**Backend changes:**
```bash
# Stop: Ctrl+C
cd backend
npm run dev
```

**Frontend changes:**
```bash
# Stop: Ctrl+C
cd frontend
npm run dev
```

**Admin changes:**
```bash
# Stop: Ctrl+C
cd admin-frontend
npm run dev
```

---

## 📦 Production Build

When ready to deploy:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Output in: frontend/dist
```

**Admin:**
```bash
cd admin-frontend
npm run build
# Output in: admin-frontend/dist
```

---

## 🎯 Quick Commands Reference

```bash
# Install everything
npm install (in each folder)

# Run migrations
cd backend && npm run setup-features

# Start development
cd backend && npm run dev
cd frontend && npm run dev
cd admin-frontend && npm run dev

# Create admin
cd backend && node scripts/createAdmin.js

# Build for production
npm run build (in frontend/admin-frontend)

# Check logs
# Backend logs show in terminal
# Check browser console for frontend errors
```

---

## 📞 Need Help?

### Check Documentation
- **QUICK_START.md** - Quick setup guide
- **TESTING_GUIDE.md** - Testing instructions
- **DEPLOYMENT_CHECKLIST.md** - Production deployment
- **FINAL_ANSWER.md** - Feature overview

### Common Commands
```bash
# Check if services are running
curl http://localhost:5000/api/test
curl http://localhost:3000
curl http://localhost:3001

# View backend logs
cd backend
npm run dev
# Watch terminal output

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

---

## ✅ Success Checklist

After setup, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Admin running on port 3001
- [ ] Database created and migrated
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3001
- [ ] Admin user created
- [ ] Can login as admin
- [ ] Dashboard graphs visible (if enabled)
- [ ] Can register as customer
- [ ] Can browse products

---

## 🎊 You're Ready!

Your e-commerce marketplace is now running with:
- ✅ Customer shopping experience
- ✅ Seller management
- ✅ Admin dashboard with graphs
- ✅ Chapa payment integration
- ✅ Responsive design
- ✅ All new features

**Happy coding!** 🚀

---

## 🔗 Quick Links

- Customer Site: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- API: http://localhost:5000/api
- API Test: http://localhost:5000/api/test
- Health Check: http://localhost:5000/api/health
