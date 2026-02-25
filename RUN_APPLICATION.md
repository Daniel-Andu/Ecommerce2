# 🚀 How to Run Your E-Commerce Application

## ✅ Prerequisites Check

Before running, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ npm installed
- ✅ TiDB Cloud database connection details
- ✅ All dependencies installed

## 📋 Quick Start (3 Steps)

### Step 1: Start Backend (Port 5001)

Open a terminal and run:

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Starting server...
Server running on:
Local: http://localhost:5001
API: http://localhost:5001/api
```

**If you see errors:**
- Check your `.env` file in backend folder
- Make sure TiDB Cloud connection details are correct
- Run `npm install` if packages are missing

---

### Step 2: Start Frontend (Port 3002)

Open a **NEW** terminal and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 3761 ms
➜  Local:   http://localhost:3002/
```

**If you see errors:**
- Check your `.env` file in frontend folder
- Make sure it has: `VITE_API_URL=http://localhost:5001/api`
- Run `npm install` if packages are missing

---

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:3002
```

You should see your beautiful, modern e-commerce homepage! 🎉

---

## 🎯 What You'll See

### Homepage
- Beautiful hero slider with animations
- Category cards with hover effects
- Featured products grid
- New arrivals section
- Features section

### Navigation
- Modern navbar with notifications bell 🔔
- Search bar
- Cart icon with badge
- User menu dropdown

### New Features
- **Notifications**: Click the bell icon → `/notifications`
- **Returns**: Go to `/returns` to request returns
- **Advanced Search**: Go to `/search` for filters
- **Seller Wallet**: Go to `/seller/wallet` (for sellers)

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem**: Port 5001 is already in use
```bash
# Kill the process using port 5001
# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5001 | xargs kill -9
```

**Problem**: Database connection error
- Check `backend/.env` file
- Verify TiDB Cloud credentials
- Make sure your IP is whitelisted in TiDB Cloud

**Problem**: Missing packages
```bash
cd backend
npm install
```

---

### Frontend Won't Start

**Problem**: Port 3002 is already in use
- Vite will automatically try another port (3003, 3004, etc.)
- Or kill the process using that port

**Problem**: API connection error
- Make sure backend is running on port 5001
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:5001/api`

**Problem**: Missing packages
```bash
cd frontend
npm install
```

---

## 📱 Testing the Application

### 1. Test Homepage
- ✅ Hero slider should animate
- ✅ Categories should show with images
- ✅ Products should load in grid
- ✅ Hover effects should work

### 2. Test Navigation
- ✅ Click on Products → Should show products page
- ✅ Click on Cart → Should show cart
- ✅ Click on Login → Should show login form

### 3. Test New Features
- ✅ Click bell icon → Should show notifications
- ✅ Go to `/returns` → Should show returns page
- ✅ Go to `/search` → Should show advanced search
- ✅ Login as seller → Go to `/seller/wallet`

### 4. Test Responsiveness
- ✅ Resize browser window
- ✅ Check mobile view (< 768px)
- ✅ Check tablet view (768px - 992px)
- ✅ Check desktop view (> 992px)

---

## 🎨 What's Different Now?

### Visual Improvements
- ✅ Modern gradient buttons
- ✅ Smooth hover animations
- ✅ Beautiful product cards
- ✅ Professional color scheme
- ✅ Responsive design

### New Features Visible
- ✅ Notifications bell in navbar
- ✅ Returns management page
- ✅ Advanced search page
- ✅ Seller wallet page
- ✅ Request return button on orders

### Better UX
- ✅ Loading skeletons
- ✅ Empty states with messages
- ✅ Error handling
- ✅ Success confirmations
- ✅ Smooth transitions

---

## 🔧 Optional: Run Admin Frontend

If you want to run the admin panel:

```bash
# Open a THIRD terminal
cd admin-frontend
npm run dev
```

It will run on a different port (usually 3000 or 3001)

---

## 📊 Quick Test Checklist

After starting the application, test these:

### Customer Features
- [ ] Browse products
- [ ] View product details
- [ ] Add to cart
- [ ] Checkout process
- [ ] View orders
- [ ] Request returns
- [ ] View notifications
- [ ] Advanced search

### Seller Features (Login as seller)
- [ ] Seller dashboard
- [ ] Manage products
- [ ] View orders
- [ ] Check wallet balance
- [ ] Request withdrawal

### Admin Features (Login as admin)
- [ ] Admin dashboard
- [ ] Manage sellers
- [ ] Manage products
- [ ] Manage orders
- [ ] View reports

---

## 🎉 Success!

If you can see the homepage with:
- ✅ Beautiful hero slider
- ✅ Category cards
- ✅ Product grids
- ✅ Smooth animations
- ✅ Modern design

**Congratulations! Your modern e-commerce application is running!** 🎊

---

## 📞 Need Help?

### Common Issues

1. **"Cannot connect to database"**
   - Check TiDB Cloud connection
   - Verify credentials in `backend/.env`
   - Check if IP is whitelisted

2. **"API not responding"**
   - Make sure backend is running
   - Check port 5001 is not blocked
   - Verify `VITE_API_URL` in frontend `.env`

3. **"Page not loading"**
   - Clear browser cache
   - Check browser console for errors
   - Verify all routes are registered

4. **"Styles not showing"**
   - Hard refresh browser (Ctrl+Shift+R)
   - Check if CSS files are loaded
   - Verify no CSS errors in console

---

## 🚀 Next Steps

1. **Create test accounts**
   - Customer account
   - Seller account
   - Admin account

2. **Add test data**
   - Products
   - Categories
   - Banners

3. **Test all features**
   - Follow the test checklist
   - Try on different devices
   - Test all user flows

4. **Deploy to production**
   - When ready, follow deployment guide
   - Set up production database
   - Configure environment variables

---

## 💡 Pro Tips

1. **Keep terminals open** - Don't close the terminal windows while testing
2. **Check console** - Open browser DevTools to see any errors
3. **Test mobile** - Resize browser to test responsive design
4. **Use incognito** - Test without cached data
5. **Check network** - Monitor API calls in Network tab

---

**Enjoy your modern, beautiful e-commerce application!** 🎉🛍️
