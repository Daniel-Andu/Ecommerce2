# 🚀 START HERE - Quick Setup

## ⚡ 5-Minute Setup

### 1️⃣ Install Dependencies (2 minutes)

Open 3 terminals and run:

```bash
# Terminal 1
cd backend
npm install

# Terminal 2
cd frontend
npm install

# Terminal 3
cd admin-frontend
npm install
npm install recharts
```

---

### 2️⃣ Setup Database (1 minute)

```bash
# Open MySQL
mysql -u root -p

# Create database
CREATE DATABASE ecommerce_marketplace;
exit;
```

---

### 3️⃣ Configure Backend (1 minute)

Edit `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_marketplace
JWT_SECRET=make_this_long_and_random
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

---

### 4️⃣ Run Migrations (30 seconds)

```bash
cd backend
npm run setup-features
```

---

### 5️⃣ Start Everything (30 seconds)

Open 3 terminals:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin
cd admin-frontend
npm run dev
```

---

## ✅ Done! Access Your App

- **Customer Site:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **API:** http://localhost:5000/api

---

## 🎯 Next Steps

### Create Admin User
```bash
cd backend
node scripts/createAdmin.js
```

### Enable Dashboard Graphs
```bash
cd admin-frontend/src/pages
mv Dashboard.jsx Dashboard.backup.jsx
mv DashboardWithGraphs.jsx Dashboard.jsx
```

Then restart admin frontend.

---

## 🐛 Having Issues?

### Port Already in Use?
```bash
# Change port in backend/.env
PORT=5001
```

### Database Connection Error?
- Check MySQL is running
- Verify password in `.env`
- Test: `mysql -u root -p`

### Module Not Found?
```bash
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install

cd ../admin-frontend
npm install recharts
```

---

## 📚 Full Documentation

- **HOW_TO_RUN.md** - Complete setup guide
- **QUICK_START.md** - Detailed instructions
- **FINAL_ANSWER.md** - Feature overview
- **TESTING_GUIDE.md** - Testing instructions

---

## 🎊 Features Included

✅ Customer shopping with cart & checkout
✅ Seller product management
✅ Admin dashboard with graphs
✅ Chapa payment integration
✅ Notifications (email & in-app)
✅ Returns & refunds
✅ Coupons & discounts
✅ Advanced search
✅ Responsive design
✅ And 10+ more features!

**Everything is ready to use!** 🚀
