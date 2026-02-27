import React, { useState } from 'react';
import './FAQ.css';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'How do I place an order?',
            answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in to complete your purchase.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept Chapa payment gateway which supports various payment methods including mobile money, bank transfers, and cards.'
        },
        {
            question: 'How long does shipping take?',
            answer: 'Shipping typically takes 3-7 business days depending on your location. You\'ll receive a tracking number once your order ships.'
        },
        {
            question: 'Can I return or exchange items?',
            answer: 'Yes! We offer a 30-day return policy for most items. Products must be unused and in original packaging. Visit our Returns page for more details.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Once your order ships, you\'ll receive an email with a tracking number. You can also track your order from your account dashboard.'
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Currently, we only ship within Ethiopia. We\'re working on expanding to international shipping soon.'
        },
        {
            question: 'How can I become a seller?',
            answer: 'Click on "Become a Seller" in the navigation menu, fill out the registration form, and wait for admin approval. Once approved, you can start listing products.'
        },
        {
            question: 'What are the seller fees?',
            answer: 'We charge a small commission on each sale. The exact percentage depends on the product category. Contact us for detailed pricing.'
        },
        {
            question: 'How do I contact customer support?',
            answer: 'You can reach us through the Contact Us page, email us at support@marketplace.com, or call +251 911 234 567 during business hours.'
        },
        {
            question: 'Is my payment information secure?',
            answer: 'Yes! We use industry-standard encryption and secure payment gateways. We never store your complete payment information.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="container">
                <div className="page-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about our marketplace</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-footer">
                    <h3>Still have questions?</h3>
                    <p>Can't find the answer you're looking for? Please contact our support team.</p>
                    <a href="/contact" className="btn btn-primary">Contact Support</a>
                </div>
            </div>
        </div>
    );
}
