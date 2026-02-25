# E-Commerce Marketplace API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Table of Contents
1. [Authentication](#authentication-endpoints)
2. [Products](#products-endpoints)
3. [Cart](#cart-endpoints)
4. [Orders](#orders-endpoints)
5. [Notifications](#notifications-endpoints)
6. [Returns & Refunds](#returns-endpoints)
7. [Withdrawals](#withdrawals-endpoints)
8. [Search](#search-endpoints)
9. [Shipping](#shipping-endpoints)
10. [Coupons](#coupons-endpoints)
11. [Reports](#reports-endpoints)
12. [Pages](#pages-endpoints)
13. [Variants](#variants-endpoints)
14. [Users](#users-endpoints)

---

## Authentication Endpoints

### Register Customer
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

### Register Seller
```http
POST /api/auth/register/seller
Content-Type: application/json

{
  "email": "seller@example.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1234567890",
  "business_name": "My Store",
  "business_address": "123 Business St",
  "business_phone": "+1234567890",
  "tax_id": "TAX123456"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "customer",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

## Notifications Endpoints

### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "type": "order",
    "title": "Order Confirmed",
    "message": "Your order #ORD-123 has been confirmed",
    "data": { "order_id": 123 },
    "is_read": false,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <token>

Response:
{
  "count": 5
}
```

### Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>

Response:
{
  "message": "Notification marked as read"
}
```

### Mark All as Read
```http
PUT /api/notifications/mark-all-read
Authorization: Bearer <token>

Response:
{
  "message": "All notifications marked as read"
}
```

---

## Returns Endpoints

### Create Return Request
```http
POST /api/returns
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- order_id: 123
- reason: "Defective product"
- description: "Product arrived damaged"
- images: [file1, file2] (optional, max 5 images)

Response:
{
  "message": "Return request submitted successfully",
  "return_id": 1,
  "return_number": "RET-1234567890-ABC123"
}
```

### Get My Returns
```http
GET /api/returns/my-returns
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "return_number": "RET-1234567890-ABC123",
    "order_id": 123,
    "order_number": "ORD-123",
    "reason": "Defective product",
    "status": "pending",
    "created_at": "2024-01-01T10:00:00Z",
    "images": ["/uploads/returns/image1.jpg"]
  }
]
```

### Get Return Details
```http
GET /api/returns/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "return_number": "RET-1234567890-ABC123",
  "order_id": 123,
  "reason": "Defective product",
  "description": "Product arrived damaged",
  "status": "pending",
  "admin_notes": null,
  "images": ["/uploads/returns/image1.jpg"],
  "items": [
    {
      "product_name": "Product Name",
      "quantity": 1,
      "unit_price": 99.99
    }
  ]
}
```

### Seller: Get Returns
```http
GET /api/returns/seller/returns
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "return_number": "RET-1234567890-ABC123",
    "order_number": "ORD-123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "customer@example.com",
    "status": "pending",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### Update Return Status
```http
PUT /api/returns/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "admin_notes": "Return approved, refund will be processed"
}

Response:
{
  "message": "Return status updated successfully"
}
```

---

## Withdrawals Endpoints

### Get Wallet Balance
```http
GET /api/withdrawals/wallet
Authorization: Bearer <token>

Response:
{
  "balance": 1500.00,
  "pending_balance": 250.00
}
```

### Get Withdrawal History
```http
GET /api/withdrawals/history
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "withdrawal_number": "WD-1234567890-ABC123",
    "amount": 500.00,
    "payment_method": "bank_transfer",
    "status": "completed",
    "created_at": "2024-01-01T10:00:00Z",
    "processed_at": "2024-01-02T10:00:00Z"
  }
]
```

### Request Withdrawal
```http
POST /api/withdrawals/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500.00,
  "payment_method": "bank_transfer",
  "account_details": {
    "bank_name": "Example Bank",
    "account_number": "1234567890",
    "account_name": "John Doe"
  }
}

Response:
{
  "message": "Withdrawal request submitted success