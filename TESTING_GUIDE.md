# Testing Guide for New Features

## Prerequisites
1. Backend server running on http://localhost:5000
2. Database migrations completed
3. Valid JWT token for authenticated requests

## 1. Notifications Testing

### Get Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/1/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected: Notifications list with order updates, low stock alerts

## 2. Returns Testing

### Create Return Request
```bash
curl -X POST http://localhost:5000/api/returns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "order_id=1" \
  -F "reason=Defective product" \
  -F "description=Product arrived damaged" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Get My Returns
```bash
curl -X GET http://localhost:5000/api/returns/my-returns \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected: Return request created with images, status tracking

## 3. Withdrawals Testing

### Get Wallet Balance
```bash
curl -X GET http://localhost:5000/api/withdrawals/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Request Withdrawal
```bash
curl -X POST http://localhost:5000/api/withdrawals/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "payment_method": "bank_transfer",
    "account_details": {
      "bank_name": "Example Bank",
      "account_number": "1234567890",
      "account_name": "John Doe"
    }
  }'
```

### Expected: Wallet balance displayed, withdrawal request created

## 4. Advanced Search Testing

### Search with Filters
```bash
curl -X GET "http://localhost:5000/api/search?q=laptop&min_price=500&max_price=2000&rating=4&in_stock=true&sort=price_low&page=1&limit=20"
```

### Autocomplete
```bash
curl -X GET "http://localhost:5000/api/search/suggestions?q=lap"
```

### Expected: Filtered products, search suggestions

## 5. Shipping Testing

### Get Shipping Methods
```bash
curl -X GET http://localhost:5000/api/shipping/methods
```

### Calculate Shipping Cost
```bash
curl -X POST http://localhost:5000/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_method_id": 1,
    "postal_code": "12345",
    "weight": 2.5
  }'
```

### Expected: List of shipping methods, calculated cost

## 6. Coupons Testing

### Validate Coupon
```bash
curl -X POST http://localhost:5000/api/coupons/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE20",
    "subtotal": 100.00
  }'
```

### Admin: Create Coupon
```bash
curl -X POST http://localhost:5000/api/coupons/admin/create \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE20",
    "discount_type": "percentage",
    "discount_value": 20,
    "min_order_amount": 50,
    "max_discount_amount": 50,
    "usage_limit": 100,
    "valid_from": "2024-01-01",
    "valid_until": "2024-12-31",
    "description": "20% off on orders above $50"
  }'
```

### Expected: Coupon validation, discount calculation

## 7. Static Pages Testing

### Get Page
```bash
curl -X GET http://localhost:5000/api/pages/about-us
```

### Admin: Create Page
```bash
curl -X POST http://localhost:5000/api/pages/admin/save \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "slug": "about-us",
    "content": "<h1>About Us</h1><p>Welcome to our store...</p>",
    "meta_description": "Learn more about our company",
    "is_published": true
  }'
```

### Expected: Page content retrieved, page created

## 8. Reports Testing

### Sales Report
```bash
curl -X GET "http://localhost:5000/api/reports/admin/sales?start_date=2024-01-01&end_date=2024-12-31&period=monthly" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Product Performance
```bash
curl -X GET http://localhost:5000/api/reports/admin/products \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Expected: Sales data, product performance metrics

## 9. Product Variants Testing

### Get Product Variants
```bash
curl -X GET http://localhost:5000/api/variants/product/1
```

### Create Variant
```bash
curl -X POST http://localhost:5000/api/variants \
  -H "Authorization: Bearer SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "sku": "PROD-001-RED-L",
    "attributes": {
      "color": "Red",
      "size": "Large"
    },
    "price": 99.99,
    "stock_quantity": 50
  }'
```

### Expected: Variants list, variant created

## 10. User Management Testing

### Get All Users (Admin)
```bash
curl -X GET "http://localhost:5000/api/users/admin/all?role=customer&status=active&page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Update User Status
```bash
curl -X PUT http://localhost:5000/api/users/admin/1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

### Expected: Users list with filters, user status updated

## Integration Testing Checklist

- [ ] User can receive notifications for order updates
- [ ] User can create return request with images
- [ ] Seller can request withdrawal
- [ ] Admin can approve/reject withdrawals
- [ ] Search returns relevant products with filters
- [ ] Shipping cost calculated correctly
- [ ] Coupon validation works with limits
- [ ] Static pages display correctly
- [ ] Reports show accurate data
- [ ] Product variants can be managed
- [ ] Admin can manage users

## Email Testing

To test email notifications:
1. Configure SMTP in .env
2. Place an order
3. Check email for order confirmation
4. Update order status
5. Check email for status update

## Performance Testing

Test with large datasets:
- 1000+ products for search
- 100+ notifications per user
- Multiple concurrent withdrawal requests
- Heavy report generation

## Security Testing

- [ ] Unauthorized access blocked
- [ ] Role-based access enforced
- [ ] SQL injection prevented
- [ ] File upload validation works
- [ ] Token expiration handled
