# Quick Test Guide - New Features

## 🚀 Start the Application

```bash
# Terminal 1 - Backend (Port 5001)
cd backend
npm run dev

# Terminal 2 - Frontend (Port 3002)
cd frontend
npm run dev
```

## ✅ Test Checklist

### 1. Notifications (2 minutes)
1. Login to the app
2. Look at the navbar - see the bell icon 🔔
3. Click the bell icon
4. You should see the Notifications Center page
5. Try marking notifications as read
6. Try deleting a notification

**URL**: `http://localhost:3002/notifications`

---

### 2. Returns Management (3 minutes)
1. Login as a customer
2. Go to "My Orders"
3. Click on a delivered order
4. You should see a "📦 Request Return" button
5. Click it to go to the returns page
6. Click "Request Return" button
7. Fill in the form:
   - Select order
   - Choose reason
   - Add description
   - Upload images (optional)
8. Submit the form
9. See your return request in the list

**URL**: `http://localhost:3002/returns`

---

### 3. Advanced Search (2 minutes)
1. Go to the search page
2. Try searching for products
3. Apply filters:
   - Select a category
   - Set price range
   - Choose minimum rating
   - Toggle "In Stock Only"
4. Try different sort options
5. Navigate through pages

**URL**: `http://localhost:3002/search`

---

### 4. Seller Wallet (3 minutes)
1. Login as a seller
2. Go to Seller Wallet
3. You should see three gradient cards:
   - Available Balance
   - Pending Balance
   - Total Earnings
4. Click "Request Withdrawal"
5. Fill in the form:
   - Enter amount
   - Bank name
   - Account number
   - Account holder name
6. Submit the request
7. See it in the withdrawal history table

**URL**: `http://localhost:3002/seller/wallet`

---

## 🎨 Visual Differences to Notice

### Before vs After

#### Navbar
- **Before**: Just cart icon
- **After**: Cart icon + Notifications bell with badge 🔔

#### Order Details
- **Before**: Just order info
- **After**: Order info + "Request Return" button for delivered orders

#### New Pages
- **Before**: 0 pages for these features
- **After**: 4 beautiful new pages:
  1. Notifications Center
  2. My Returns
  3. Advanced Search
  4. Seller Wallet

---

## 🎯 Key Features to Show

### 1. Real-time Notifications
- Bell icon updates automatically
- Badge shows unread count
- Disappears when all read

### 2. Beautiful UI
- Gradient cards in wallet
- Color-coded status badges
- Smooth animations
- Loading states
- Empty states

### 3. Mobile Responsive
- Try resizing browser
- All pages adapt perfectly
- Touch-friendly buttons

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend not starting?
```bash
cd frontend
npm install
npm run dev
```

### Database errors?
- Check your `.env` file in backend
- Make sure TiDB Cloud connection is working
- Run migrations: `node backend/scripts/migrations.sql`

### API errors?
- Check backend is running on port 5001
- Check frontend `.env` has: `VITE_API_URL=http://localhost:5001/api`

---

## 📸 Screenshots to Take

1. **Navbar with notification bell**
2. **Notifications Center page**
3. **Returns page with form**
4. **Advanced Search with filters**
5. **Seller Wallet with gradient cards**
6. **Order Detail with Return button**

---

## 🎉 Success Criteria

You'll know it's working when:

✅ You see the bell icon in navbar
✅ Clicking bell shows notifications page
✅ You can create return requests
✅ Advanced search filters work
✅ Seller wallet shows balances
✅ Withdrawal requests can be submitted
✅ Everything looks beautiful and modern
✅ Everything works on mobile

---

## 📝 Quick Demo Script

**"Let me show you the new features..."**

1. **"First, notice the bell icon in the navbar"**
   - Click it → Shows notifications
   - Mark as read → Badge updates

2. **"Now let's request a return"**
   - Go to orders → Click delivered order
   - Click "Request Return" button
   - Fill form → Submit
   - See in returns list

3. **"Check out the advanced search"**
   - Go to /search
   - Apply filters
   - Sort results
   - Show pagination

4. **"Finally, the seller wallet"**
   - Go to /seller/wallet
   - Show gradient cards
   - Request withdrawal
   - Show history table

**"All these features have full backend APIs and beautiful UI!"**

---

## 🔗 Quick Links

- Frontend: `http://localhost:3002`
- Backend API: `http://localhost:5001/api`
- Notifications: `http://localhost:3002/notifications`
- Returns: `http://localhost:3002/returns`
- Search: `http://localhost:3002/search`
- Wallet: `http://localhost:3002/seller/wallet`

---

## 💡 Pro Tips

1. **Open DevTools** to see API calls
2. **Check Network tab** to see requests
3. **Try on mobile** by resizing browser
4. **Test error states** by disconnecting backend
5. **Check loading states** by throttling network

---

## 🎊 That's It!

You now have a complete, feature-rich e-commerce marketplace with:
- Notifications system
- Returns management
- Advanced search
- Seller wallet
- Beautiful UI
- Mobile responsive

**Enjoy testing!** 🚀
