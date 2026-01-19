'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/styles/OrderTracking.module.css';
import Link from 'next/link';
import { FaMagnifyingGlass, FaBox, FaTruck, FaCheck, FaSpinner, FaClock, FaXmark, FaArrowLeft } from 'react-icons/fa6';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: FaClock },
    { key: 'confirmed', label: 'Confirmed', icon: FaCheck },
    { key: 'processing', label: 'Processing', icon: FaBox },
    { key: 'shipped', label: 'Shipped', icon: FaTruck },
    { key: 'delivered', label: 'Delivered', icon: FaCheck }
];

const statusIndex = {
    'pending': 0,
    'confirmed': 1,
    'processing': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': -1
};

export default function OrderTracking() {
    const searchParams = useSearchParams();
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Auto-fill from URL params and auto-search
    useEffect(() => {
        const orderParam = searchParams.get('order');
        const emailParam = searchParams.get('email');

        if (orderParam && emailParam) {
            setOrderNumber(orderParam);
            setEmail(emailParam);
            // Auto-search after setting values
            handleAutoSearch(orderParam, emailParam);
        }
    }, [searchParams]);

    const handleAutoSearch = async (orderNum, emailAddr) => {
        setError('');
        setOrder(null);
        setSearched(true);
        setLoading(true);

        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber: orderNum, email: emailAddr })
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.error || 'Order not found');
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setSearched(true);

        if (!orderNumber.trim() || !email.trim()) {
            setError('Please enter both order number and email');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() })
            });

            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.error || 'Order not found');
            }
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStep = () => {
        if (!order) return -1;
        return statusIndex[order.status] ?? -1;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.main}>
            <div className="container">
                <div className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        <FaArrowLeft /> Back to Home
                    </Link>
                    <h1>Track Your Order</h1>
                    <p>Enter your order number and email to check the status of your order</p>
                </div>

                {/* Search Form */}
                <div className={styles.searchCard}>
                    <form onSubmit={handleSubmit} className={styles.searchForm}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="orderNumber">Order Number</label>
                            <input
                                type="text"
                                id="orderNumber"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g., ECMKJWTSC1"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email used during checkout"
                            />
                        </div>
                        <button type="submit" className={styles.trackBtn} disabled={loading}>
                            {loading ? (
                                <><FaSpinner className={styles.spinner} /> Searching...</>
                            ) : (
                                <><FaMagnifyingGlass /> Track Order</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && searched && (
                    <div className={styles.errorCard}>
                        <FaXmark />
                        <p>{error}</p>
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div>
                                <h2>Order #{order.orderNumber}</h2>
                                <p>Placed on {formatDate(order.createdAt)}</p>
                            </div>
                            <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                                {order.status === 'cancelled' ? 'Cancelled' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                        </div>

                        {/* Status Progress */}
                        {order.status !== 'cancelled' ? (
                            <div className={styles.progressSection}>
                                <h3>Order Status</h3>
                                <div className={styles.progressBar}>
                                    {statusSteps.map((step, index) => {
                                        const currentStep = getCurrentStep();
                                        const isCompleted = index <= currentStep;
                                        const isCurrent = index === currentStep;
                                        const Icon = step.icon;

                                        return (
                                            <div
                                                key={step.key}
                                                className={`${styles.progressStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                                            >
                                                <div className={styles.stepIcon}>
                                                    <Icon />
                                                </div>
                                                <span>{step.label}</span>
                                                {index < statusSteps.length - 1 && (
                                                    <div className={`${styles.stepLine} ${isCompleted ? styles.completed : ''}`} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.cancelledMessage}>
                                <FaXmark />
                                <p>This order has been cancelled. If you have any questions, please contact our support team.</p>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className={styles.itemsSection}>
                            <h3>Order Items</h3>
                            <div className={styles.itemsList}>
                                {order.items?.map((item, index) => (
                                    <div key={index} className={styles.orderItem}>
                                        <div className={styles.itemInfo}>
                                            <h4>{item.name}</h4>
                                            <p>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                                        </div>
                                        <div className={styles.itemTotal}>
                                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className={styles.summarySection}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total</span>
                                <span>₹{order.total?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className={styles.addressSection}>
                            <h3>Shipping Address</h3>
                            <p>{order.address}</p>
                            <p>{order.city}, {order.state} - {order.pincode}</p>
                        </div>

                        {/* Payment Info */}
                        <div className={styles.paymentSection}>
                            <h3>Payment</h3>
                            <p>
                                <strong>Method:</strong> {order.paymentMethod?.toUpperCase() || 'COD'}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span className={`${styles.paymentStatus} ${styles[order.paymentStatus]}`}>
                                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className={styles.helpSection}>
                    <h3>Need Help?</h3>
                    <p>If you have any questions about your order, please <Link href="/contact">contact us</Link>.</p>
                </div>
            </div>
        </div>
    );
}
