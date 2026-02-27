import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending message
        toast.success('Message sent! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contact-page">
            <div className="container">
                <div className="page-header">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Send us a message!</p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <div className="info-card">
                            <div className="info-icon">📧</div>
                            <h3>Email</h3>
                            <p>support@marketplace.com</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">📞</div>
                            <h3>Phone</h3>
                            <p>+251 911 234 567</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <h3>Address</h3>
                            <p>Addis Ababa, Ethiopia</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">⏰</div>
                            <h3>Business Hours</h3>
                            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                            <p>Sat: 10:00 AM - 4:00 PM</p>
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="How can we help?"
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Your message..."
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
