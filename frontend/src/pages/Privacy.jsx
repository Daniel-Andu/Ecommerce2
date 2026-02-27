import React from 'react';
import './Privacy.css';

export default function Privacy() {
    return (
        <div className="privacy-page">
            <div className="container">
                <div className="page-header">
                    <h1>Privacy Policy</h1>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="content-section">
                    <h2>1. Information We Collect</h2>
                    <p>We collect information that you provide directly to us, including:</p>
                    <ul>
                        <li>Name, email address, and contact information</li>
                        <li>Shipping and billing addresses</li>
                        <li>Payment information (processed securely through Chapa)</li>
                        <li>Order history and preferences</li>
                        <li>Communications with customer service</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Provide customer support</li>
                        <li>Send you marketing communications (with your consent)</li>
                        <li>Improve our services and user experience</li>
                        <li>Detect and prevent fraud</li>
                    </ul>

                    <h2>3. Information Sharing</h2>
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul>
                        <li>Sellers to fulfill your orders</li>
                        <li>Payment processors to process transactions</li>
                        <li>Shipping companies to deliver your orders</li>
                        <li>Service providers who assist in our operations</li>
                        <li>Law enforcement when required by law</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information, including:</p>
                    <ul>
                        <li>Encryption of sensitive data</li>
                        <li>Secure payment processing</li>
                        <li>Regular security audits</li>
                        <li>Access controls and authentication</li>
                    </ul>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Export your data</li>
                    </ul>

                    <h2>6. Cookies</h2>
                    <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.</p>

                    <h2>7. Children's Privacy</h2>
                    <p>Our services are not intended for children under 13. We do not knowingly collect information from children under 13.</p>

                    <h2>8. Changes to This Policy</h2>
                    <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

                    <h2>9. Contact Us</h2>
                    <p>If you have questions about this privacy policy, please contact us at:</p>
                    <ul>
                        <li>Email: privacy@marketplace.com</li>
                        <li>Phone: +251 911 234 567</li>
                        <li>Address: Addis Ababa, Ethiopia</li>
                    </ul>

                    <div className="help-box">
                        <h3>Questions?</h3>
                        <p>If you have any questions about our privacy practices, please don't hesitate to contact us.</p>
                        <a href="/contact" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
