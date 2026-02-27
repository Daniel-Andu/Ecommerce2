import React from 'react';
import './Terms.css';

export default function Terms() {
    return (
        <div className="terms-page">
            <div className="container">
                <div className="page-header">
                    <h1>Terms of Service</h1>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="content-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using this marketplace, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2>2. Use License</h2>
                    <p>Permission is granted to temporarily access the materials on our marketplace for personal, non-commercial transitory viewing only.</p>
                    <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul>
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose</li>
                        <li>Attempt to decompile or reverse engineer any software</li>
                        <li>Remove any copyright or other proprietary notations</li>
                        <li>Transfer the materials to another person</li>
                    </ul>

                    <h2>3. User Accounts</h2>
                    <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                    <ul>
                        <li>Maintaining the security of your account</li>
                        <li>All activities that occur under your account</li>
                        <li>Notifying us immediately of any unauthorized use</li>
                    </ul>

                    <h2>4. Seller Terms</h2>
                    <p>If you register as a seller, you agree to:</p>
                    <ul>
                        <li>Provide accurate product descriptions</li>
                        <li>Honor all sales and transactions</li>
                        <li>Ship products in a timely manner</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Pay applicable fees and commissions</li>
                    </ul>

                    <h2>5. Prohibited Activities</h2>
                    <p>You may not use our marketplace to:</p>
                    <ul>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Transmit harmful or malicious code</li>
                        <li>Engage in fraudulent activities</li>
                        <li>Harass or harm other users</li>
                        <li>Sell prohibited or illegal items</li>
                    </ul>

                    <h2>6. Product Listings</h2>
                    <p>All product listings must:</p>
                    <ul>
                        <li>Be accurate and truthful</li>
                        <li>Include clear product images</li>
                        <li>Specify correct pricing</li>
                        <li>Comply with our content guidelines</li>
                    </ul>

                    <h2>7. Payments and Refunds</h2>
                    <p>All payments are processed through secure payment gateways. Refunds are subject to our return policy and seller approval.</p>

                    <h2>8. Intellectual Property</h2>
                    <p>The content, organization, graphics, design, and other matters related to the marketplace are protected under applicable copyrights and other proprietary laws.</p>

                    <h2>9. Limitation of Liability</h2>
                    <p>We shall not be liable for any damages arising from the use or inability to use our marketplace, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>

                    <h2>10. Termination</h2>
                    <p>We may terminate or suspend your account and access to the marketplace immediately, without prior notice, for conduct that we believe violates these Terms of Service.</p>

                    <h2>11. Governing Law</h2>
                    <p>These terms shall be governed by and construed in accordance with the laws of Ethiopia.</p>

                    <h2>12. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. We will notify users of any material changes.</p>

                    <h2>13. Contact Information</h2>
                    <p>For questions about these Terms of Service, please contact us at:</p>
                    <ul>
                        <li>Email: legal@marketplace.com</li>
                        <li>Phone: +251 911 234 567</li>
                        <li>Address: Addis Ababa, Ethiopia</li>
                    </ul>

                    <div className="help-box">
                        <h3>Questions About Our Terms?</h3>
                        <p>If you have any questions about our terms of service, please contact us.</p>
                        <a href="/contact" className="btn btn-primary">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
