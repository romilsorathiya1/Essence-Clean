'use client';

import { useState } from 'react';
import styles from '../../styles/Contact.module.css';
import { FaPhone, FaEnvelope, FaWhatsapp, FaLocationDot, FaClock, FaInstagram, FaFacebook, FaTwitter, FaPaperPlane, FaCheck } from 'react-icons/fa6';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    setIsSubmitted(false);
                }, 3000);
            } else {
                alert(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`${styles.heroContainer} container`}>
                    <span className={styles.badge}>Get in Touch</span>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleAccent}>We'd Love to</span>
                        <span className={styles.titleMain}>Hear From You</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Have questions about our products or bulk orders? Whether you're a hotel, cafe, office, or home,
                        our team is here to help.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection}>
                <div className="container">
                    <div className={styles.contactGrid}>
                        {/* Contact Info */}
                        <div className={styles.contactInfo}>
                            <h2>Let's Connect</h2>
                            <p>Reach out to us through any of these channels. We typically respond within 24 hours.</p>

                            <div className={styles.infoCards}>
                                <a href="tel:+919876543210" className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <FaPhone />
                                    </div>
                                    <div className={styles.infoContent}>
                                        <h3>Phone</h3>
                                        <p>+91 98765 43210</p>
                                    </div>
                                </a>

                                <a href="mailto:hello@essenceclean.in" className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <FaEnvelope />
                                    </div>
                                    <div className={styles.infoContent}>
                                        <h3>Email</h3>
                                        <p>hello@essenceclean.in</p>
                                    </div>
                                </a>

                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <FaLocationDot />
                                    </div>
                                    <div className={styles.infoContent}>
                                        <h3>Address</h3>
                                        <p>Mumbai, Maharashtra, India</p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.infoIcon}>
                                        <FaClock />
                                    </div>
                                    <div className={styles.infoContent}>
                                        <h3>Business Hours</h3>
                                        <p>Mon - Sat: 9AM - 6PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className={styles.socialSection}>
                                <h3>Follow Us</h3>
                                <div className={styles.socialLinks}>
                                    <a href="#" className={styles.socialLink}>
                                        <FaInstagram />
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        <FaFacebook />
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        <FaTwitter />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={styles.formWrapper}>
                            <div className={styles.formCard}>
                                <h2>Send us a Message</h2>
                                <p>Fill out the form below and we'll get back to you soon.</p>

                                {isSubmitted ? (
                                    <div className={styles.successMessage}>
                                        <div className={styles.successIcon}>
                                            <FaCheck />
                                        </div>
                                        <h3>Message Sent!</h3>
                                        <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="name">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your name"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="phone">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="subject">Subject</label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select a topic</option>
                                                    <option value="product">Product Inquiry</option>
                                                    <option value="order">Order Status</option>
                                                    <option value="bulk">Bulk Order / B2B</option>
                                                    <option value="feedback">Feedback</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label htmlFor="message">Your Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="How can we help you?"
                                                rows="5"
                                                required
                                            ></textarea>
                                        </div>

                                        <button type="submit" className={styles.submitBtn}>
                                            <FaPaperPlane />
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Teaser */}
            <section className={styles.faqTeaser} id='faq'>
                <div className="container">
                    <div className={styles.faqContent}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqGrid}>
                            <div className={styles.faqItem}>
                                <h3>What surfaces can I use Essence Clean on?</h3>
                                <p>Our formula is safe for all commercial and residential surfaces including glass, countertops, appliances, bathrooms, and kitchen surfaces.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Is Essence Clean safe for staff and customers?</h3>
                                <p>Yes! Our 100% plant-based formula contains no harsh chemicals and is completely safe for use in hotels, restaurants, offices, and homes.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>How long does one bottle last for commercial use?</h3>
                                <p>Usage varies by business size. Contact us for custom volume recommendations for your hotel, cafe, or office.</p>
                            </div>
                            <div className={styles.faqItem}>
                                <h3>Do you offer bulk discounts?</h3>
                                <p>Yes! Contact our B2B team for special pricing on bulk orders for businesses.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
