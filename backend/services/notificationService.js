const pool = require('../config/db');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Create in-app notification
async function createNotification(userId, type, title, message, data = null) {
    try {
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, data, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
            [userId, type, title, message, JSON.stringify(data)]
        );
    } catch (err) {
        console.error('Create notification error:', err);
    }
}

// Send email notification
async function sendEmail(to, subject, html) {
    if (!process.env.SMTP_USER) {
        console.log('Email not configured, skipping:', subject);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"${process.env.APP_NAME || 'E-Commerce'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', subject);
    } catch (err) {
        console.error('Send email error:', err);
    }
}

// Order status notification
async function notifyOrderStatus(orderId, status) {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.email, u.first_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
            [orderId]
        );

        if (!orders.length) return;

        const order = orders[0];
        const statusMessages = {
            confirmed: 'Your order has been confirmed',
            processing: 'Your order is being processed',
            shipped: 'Your order has been shipped',
            delivered: 'Your order has been delivered',
            cancelled: 'Your order has been cancelled'
        };

        const title = statusMessages[status] || 'Order status updated';
        const message = `Order #${order.order_number} status: ${status}`;

        await createNotification(order.user_id, 'order', title, message, { order_id: orderId });

        const emailHtml = `
      <h2>${title}</h2>
      <p>Hello ${order.first_name},</p>
      <p>${message}</p>
      <p>Order Total: $${order.total}</p>
      <p><a href="${process.env.FRONTEND_URL}/orders/${orderId}">View Order Details</a></p>
    `;

        await sendEmail(order.email, title, emailHtml);
    } catch (err) {
        console.error('Notify order status error:', err);
    }
}

// New order notification for seller
async function notifySellerNewOrder(orderId) {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.email, u.first_name 
       FROM orders o 
       JOIN sellers s ON o.seller_id = s.id 
       JOIN users u ON s.user_id = u.id 
       WHERE o.id = ?`,
            [orderId]
        );

        if (!orders.length) return;

        const order = orders[0];
        const title = 'New Order Received';
        const message = `You have a new order #${order.order_number}`;

        await createNotification(order.user_id, 'order', title, message, { order_id: orderId });

        const emailHtml = `
      <h2>${title}</h2>
      <p>Hello ${order.first_name},</p>
      <p>${message}</p>
      <p>Order Total: $${order.total}</p>
      <p><a href="${process.env.FRONTEND_URL}/seller/orders/${orderId}">View Order</a></p>
    `;

        await sendEmail(order.email, title, emailHtml);
    } catch (err) {
        console.error('Notify seller new order error:', err);
    }
}

// Low stock notification
async function notifyLowStock(productId) {
    try {
        const [products] = await pool.query(
            `SELECT p.*, u.email, u.first_name 
       FROM products p 
       JOIN sellers s ON p.seller_id = s.id 
       JOIN users u ON s.user_id = u.id 
       WHERE p.id = ?`,
            [productId]
        );

        if (!products.length) return;

        const product = products[0];
        const title = 'Low Stock Alert';
        const message = `Product "${product.name}" is low on stock (${product.stock_quantity} remaining)`;

        await createNotification(product.user_id, 'stock', title, message, { product_id: productId });

        const emailHtml = `
      <h2>${title}</h2>
      <p>Hello ${product.first_name},</p>
      <p>${message}</p>
      <p><a href="${process.env.FRONTEND_URL}/seller/products">Manage Inventory</a></p>
    `;

        await sendEmail(product.email, title, emailHtml);
    } catch (err) {
        console.error('Notify low stock error:', err);
    }
}

module.exports = {
    createNotification,
    sendEmail,
    notifyOrderStatus,
    notifySellerNewOrder,
    notifyLowStock
};
