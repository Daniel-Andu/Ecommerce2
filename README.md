# E-Commerce Marketplace - Full Stack Application

A comprehensive multi-vendor e-commerce marketplace platform with customer, seller, and admin functionalities.

## 🚀 Features

### Customer Features
- ✅ User registration and authentication
- ✅ Product browsing with advanced search and filters
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Order placement and tracking
- ✅ Multiple shipping addresses
- ✅ Product reviews and ratings
- ✅ Return requests with image upload
- ✅ Coupon code application
- ✅ In-app and email notifications
- ✅ Order history and invoices

### Seller Features
- ✅ Seller registration with business details
- ✅ Product management (CRUD)
- ✅ Product variants (size, color, etc.)
- ✅ Inventory management
- ✅ Order management
- ✅ Sales dashboard and analytics
- ✅ Wallet and earnings tracking
- ✅ Withdrawal requests
- ✅ Return request handling
- ✅ Low stock notifications

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ User management
- ✅ Seller approval/rejection
- ✅ Product approval/rejection
- ✅ Category management
- ✅ Order management
- ✅ Banner management
- ✅ Coupon management
- ✅ Shipping methods configuration
- ✅ Static pages CMS (About, Terms, Privacy)
- ✅ Withdrawal approval/rejection
- ✅ Return request management
- ✅ Sales and product reports
- ✅ Revenue analytics

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MySQL/TiDB (Cloud database)
- JWT Authentication
- Multer (File uploads)
- Nodemailer (Email notifications)
- Bcrypt (Password hashing)

### Frontend
- React 18
- React Router v6
- Vite
- Axios
- React Hot Toast

### Admin Frontend
- React 18
- Recharts (Analytics charts)
- date-fns

### Payment Gateway
- Chapa (Ethiopian payment gateway)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations
```bash
npm run setup-features
```

5. Start the server
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with backend URL
```

4. Start development server
```bash
npm run dev
```

### Admin Frontend Setup

1. Navigate to admin-frontend directory
```bash
cd admin-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_marketplace

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=5000
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Chapa Payment
CHAPA_SECRET_KEY=your_chapa_key
CHAPA_BASE_URL=https://api.chapa.co/v1

# Email (NEW)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=E-Commerce Marketplace
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/register/seller` - Seller registration
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

#### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/search` - Advanced search with filters

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

#### Notifications (NEW)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

#### Returns (NEW)
- `POST /api/returns` - Create return request
- `GET /api/returns/my-returns` - Get user returns
- `PUT /api/returns/:id/status` - Update return status

#### Withdrawals (NEW)
- `GET /api/withdrawals/wallet` - Get wallet balance
- `POST /api/withdrawals/request` - Request withdrawal
- `GET /api/withdrawals/history` - Get withdrawal history

#### Coupons (NEW)
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons/admin/create` - Create coupon (Admin)

#### Reports (NEW)
- `GET /api/reports/admin/sales` - Sales report (Admin)
- `GET /api/reports/admin/products` - Product performance (Admin)

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🗄️ Database Schema

### Core Tables
- users
- sellers
- products
- product_images
- product_variants (NEW)
- categories
- orders
- order_items
- cart
- wishlist
- reviews
- addresses

### New Tables
- notifications
- returns
- return_images
- refunds
- withdrawals
- shipping_methods
- coupons
- coupon_usage
- pages

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For manual testing, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

## 📖 Documentation

- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Detailed feature implementation
- [New Features Summary](NEW_FEATURES_SUMMARY.md) - Quick overview of new features
- [Testing Guide](TESTING_GUIDE.md) - Testing instructions
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in hosting platform
2. Deploy from GitHub repository
3. Run migrations: `npm run setup-features`
4. Start server: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables
5. Deploy

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CORS configuration
- File upload validation
- Role-based access control

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@example.com

## 🎯 Roadmap

### Completed ✅
- Multi-vendor marketplace
- Payment integration (Chapa)
- Notifications system
- Returns & refunds
- Seller withdrawals
- Advanced search
- Coupons & discounts
- Reports & analytics
- Product variants
- User management

### Upcoming 🚧
- Social login (OAuth)
- Two-factor authentication
- Multi-currency support
- Multi-language (i18n)
- Loyalty points system
- Mobile app
- Real-time chat
- Advanced analytics

## 🙏 Acknowledgments

- Chapa Payment Gateway
- TiDB Cloud
- React community
- Node.js community
