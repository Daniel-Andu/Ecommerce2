import React from 'react';
import './Shipping.css';

export default function Shipping() {
    return (
        <div className="shipping-page">
            <div className="container">
                <div className="page-header">
                    <h1>Shipping Information</h1>
                    <p>Everything you need to know about our shipping policy</p>
                </div>

                <div className="content-section">
                    <h2>Shipping Methods</h2>
                    <div className="shipping-methods">
                        <div className="method-card">
                            <div className="method-icon">🚚</div>
                            <h3>Standard Shipping</h3>
                            <p className="delivery-time">5-7 Business Days</p>
                            <p className="price">ETB 50</p>
                        </div>

                        <div className="method-card featured">
                            <div className="method-icon">⚡</div>
                            <h3>Express Shipping</h3>
                            <p className="delivery-time">2-3 Business Days</p>
                            <p className="price">ETB 100</p>
                        </div>

                        <div className="method-card">
                            <div className="method-icon">🎁</div>
                            <h3>Free Shipping</h3>
                            <p className="delivery-time">7-10 Business Days</p>
                            <p className="price">Orders over ETB 1000</p>
                        </div>
                    </div>

                    <h2>Shipping Locations</h2>
                    <p>We currently ship to all major cities in Ethiopia including:</p>
                    <ul>
                        <li>Addis Ababa</li>
                        <li>Dire Dawa</li>
                        <li>Mekelle</li>
                        <li>Gondar</li>
                        <li>Bahir Dar</li>
                        <li>Hawassa</li>
                        <li>And more...</li>
                    </ul>

                    <h2>Order Processing</h2>
                    <p>Orders are processed within 1-2 business days. You will receive a confirmation email once your order has been shipped with tracking information.</p>

                    <h2>Tracking Your Order</h2>
                    <p>Once your order ships, you'll receive:</p>
                    <ul>
                        <li>Email notification with tracking number</li>
                        <li>Real-time tracking updates</li>
                        <li>Estimated delivery date</li>
                        <li>Delivery confirmation</li>
                    </ul>

                    <h2>Shipping Restrictions</h2>
                    <p>Some items may have shipping restrictions due to size, weight, or regulations. These restrictions will be noted on the product page.</p>

                    <h2>International Shipping</h2>
                    <p>We currently only ship within Ethiopia. International shipping is coming soon!</p>

                    <div className="help-box">
                        <h3>Need Help?</h3>
                        <p>If you have questions about shipping, please contact our customer service team.</p>
                        <a href="/contact" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
