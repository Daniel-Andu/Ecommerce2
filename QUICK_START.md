# Quick Start Guide

Get your e-commerce marketplace running in 5 minutes!

## 1. Prerequisites

- Node.js v14+ installed
- MySQL v8+ installed and running
- Git installed

## 2. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd ecommerce-marketplace

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin frontend dependencies
cd ../admin-frontend
npm install
```

## 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE ecommerce_marketplace;
exit;

# Run migrations
cd backend
npm run setup-features
```

## 4. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with backend URL

# Admin Frontend
cd ../admin-frontend
cp .env.example .env
# Edit .env with backend URL
```

## 5. Start Services

Open 3 terminal windows:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Terminal 3 - Admin Frontend
```bash
cd admin-frontend
npm run dev
# Admin runs on http://localhost:3001
```

## 6. Create Admin User

```bash
cd backend
node scripts/createAdmin.js
# Follow prompts to create admin account
```

## 7. Access Application

- **Customer Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001
- **API:** http://localhost:5000/api

## 8. Test Features

### Register as Customer
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in details
4. Login

### Register as Seller
1. Go to http://localhost:3000
2. Click "Become a Seller"
3. Fill in business details
4. Wait for admin approval

### Login as Admin
1. Go to http://localhost:3001
2. Use admin credentials
3. Approve sellers
4. Manage products

## 9. Test New Features

### Notifications
- Place an order
- Check notifications icon
- Receive email notification

### Returns
- Complete an order
- Go to order details
- Click "Request Return"
- Upload images

### Withdrawals (Seller)
- Login as seller
- Go to wallet
- Request withdrawal
- Admin approves

### Search
- Use search bar
- Apply filters (price, rating, category)
- Sort results

### Coupons
- Admin creates coupon
- Customer applies at checkout
- Discount applied

## 10. Common Issues

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_marketplace
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001

# Or kill process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Email Not Sending
```bash
# Configure SMTP in backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# For Gmail, enable "Less secure app access"
# Or use App Password
```

### File Upload Error
```bash
# Create upload directories
cd backend
mkdir -p uploads/products
mkdir -p uploads/categories
mkdir -p uploads/profile-images
mkdir -p uploads/returns

# Set permissions (Linux/Mac)
chmod 755 uploads
chmod 755 uploads/*
```

## 11. Development Tips

### Hot Reload
All services use hot reload - changes reflect automatically

### API Testing
Use Postman or curl:
```bash
# Test API
curl http://localhost:5000/api/test

# Test with auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/notifications
```

### Database Reset
```bash
# Drop and recreate
mysql -u root -p
DROP DATABASE ecommerce_marketplace;
CREATE DATABASE ecommerce_marketplace;
exit;

# Run migrations again
npm run setup-features
```

### View Logs
```bash
# Backend logs
cd backend
npm run dev
# Watch console output

# Check error logs
tail -f logs/error.log
```

## 12. Next Steps

- [ ] Customize branding
- [ ] Add products
- [ ] Configure payment gateway
- [ ] Set up email templates
- [ ] Deploy to production

## 13. Useful Commands

```bash
# Backend
npm start          # Production
npm run dev        # Development
npm run setup-features  # Run migrations

# Frontend
npm run dev        # Development
npm run build      # Production build
npm run preview    # Preview build

# Database
npm run init-db    # Initialize database
npm run seed       # Seed sample data
```

## 14. Documentation

- [README.md](README.md) - Project overview
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Feature details
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing instructions
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment guide

## 15. Support

Need help?
- Check documentation
- Review error logs
- Search GitHub issues
- Contact support team

## 🎉 You're Ready!

Your e-commerce marketplace is now running with all features:
- ✅ Customer shopping
- ✅ Seller management
- ✅ Admin dashboard
- ✅ Notifications
- ✅ Returns & refunds
- ✅ Withdrawals
- ✅ Advanced search
- ✅ Coupons
- ✅ Reports
- ✅ And more!

Happy coding! 🚀
