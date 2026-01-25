'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/Checkout.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaLock, FaTruck, FaShieldHeart } from 'react-icons/fa6';

export default function Checkout() {
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Full name is required';
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = 'Please enter a valid email';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
            newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsSubmitting(true);

        try {
            const shipping = cartTotal >= 999 ? 0 : 99;

            const orderData = {
                ...formData,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                shipping
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                setOrderNumber(data.data.orderNumber);
                setOrderPlaced(true);
                clearCart();
            } else {
                alert(data.error || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const shipping = cartTotal >= 999 ? 0 : 99;
    const total = cartTotal + shipping;

    const downloadInvoice = async () => {
        try {
            const response = await fetch(`/api/orders/${orderNumber}/invoice`);
            if (!response.ok) throw new Error('Failed to download invoice');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice. Please try again.');
        }
    };

    // Order Confirmation View
    if (orderPlaced) {
        return (
            <div className={styles.main}>
                <div className={styles.confirmationContainer}>
                    <div className={styles.confirmationBox}>
                        <div className={styles.successIcon}>
                            <FaCheck />
                        </div>
                        <h1>Order Placed Successfully!</h1>
                        <p className={styles.orderNumberText}>
                            Your order number is: <strong>{orderNumber}</strong>
                        </p>
                        <p className={styles.confirmationMessage}>
                            Thank you for your order! We've sent a confirmation email to {formData.customerEmail}.
                            Our team will process your order and you'll receive shipping updates soon.
                        </p>
                        <div className={styles.confirmationActions}>
                            <div className={styles.actionButtons}>
                                <Link href={`/track-order?order=${orderNumber}&email=${encodeURIComponent(formData.customerEmail)}`} className={styles.trackBtn}>
                                    Track Your Order
                                </Link>
                                <button onClick={downloadInvoice} className={styles.homeBtn}>
                                    Download Invoice
                                </button>
                            </div>
                            <Link href="/products" className={styles.shopBtn}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty Cart View
    if (cartItems.length === 0) {
        return (
            <div className={styles.main}>
                <div className={styles.emptyContainer}>
                    <h1>Your Cart is Empty</h1>
                    <p>Add some products before checking out.</p>
                    <Link href="/products" className={styles.shopBtn}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <div className="container">
                <div className={styles.header}>
                    <Link href="/products" className={styles.backLink}>
                        <FaArrowLeft /> Back to Shop
                    </Link>
                    <h1>Checkout</h1>
                </div>

                <div className={styles.checkoutGrid}>
                    {/* Checkout Form */}
                    <div className={styles.formSection}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <h2>Contact Information</h2>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="customerName">Full Name *</label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={errors.customerName ? styles.inputError : ''}
                                    />
                                    {errors.customerName && <span className={styles.error}>{errors.customerName}</span>}
                                </div>

                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="customerEmail">Email Address *</label>
                                        <input
                                            type="email"
                                            id="customerEmail"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className={errors.customerEmail ? styles.inputError : ''}
                                        />
                                        {errors.customerEmail && <span className={styles.error}>{errors.customerEmail}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="customerPhone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="customerPhone"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            className={errors.customerPhone ? styles.inputError : ''}
                                        />
                                        {errors.customerPhone && <span className={styles.error}>{errors.customerPhone}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <h2>Shipping Address</h2>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="address">Street Address *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="House/Flat No., Building, Street, Area"
                                        rows={3}
                                        className={errors.address ? styles.inputError : ''}
                                    />
                                    {errors.address && <span className={styles.error}>{errors.address}</span>}
                                </div>

                                <div className={styles.inputRow}>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="city">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            className={errors.city ? styles.inputError : ''}
                                        />
                                        {errors.city && <span className={styles.error}>{errors.city}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="state">State *</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                            className={errors.state ? styles.inputError : ''}
                                        />
                                        {errors.state && <span className={styles.error}>{errors.state}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label htmlFor="pincode">Pincode *</label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="6-digit pincode"
                                            className={errors.pincode ? styles.inputError : ''}
                                        />
                                        {errors.pincode && <span className={styles.error}>{errors.pincode}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <h2>Payment Method</h2>

                                <div className={styles.paymentOptions}>
                                    <label className={`${styles.paymentOption} ${formData.paymentMethod === 'cod' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                        />
                                        <div className={styles.paymentContent}>
                                            <strong>Cash on Delivery</strong>
                                            <span>Pay when your order arrives</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <h2>Order Notes (Optional)</h2>
                                <div className={styles.inputGroup}>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Any special instructions for your order..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.placeOrderBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Placing Order...' : `Place Order • ₹${total.toLocaleString()}`}
                            </button>

                            <div className={styles.securityNote}>
                                <FaLock /> Your information is secure and encrypted
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summarySection}>
                        <div className={styles.summaryCard}>
                            <h2>Order Summary</h2>

                            <div className={styles.summaryItems}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className={styles.summaryItem}>
                                        <div className={styles.itemImage}>
                                            <img src={item.image} alt={item.name} />
                                            <span className={styles.itemQty}>{item.quantity}</span>
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price.toLocaleString()} × {item.quantity}</p>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryTotals}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                </div>
                                {shipping === 0 && (
                                    <div className={styles.freeShipping}>
                                        <FaTruck /> Free shipping on orders above ₹999!
                                    </div>
                                )}
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className={styles.trustBadges}>
                                <div className={styles.trustItem}>
                                    <FaShieldHeart />
                                    <span>100% Secure</span>
                                </div>
                                <div className={styles.trustItem}>
                                    <FaTruck />
                                    <span>Fast Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
