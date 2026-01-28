'use client';

import { useEffect, useState } from 'react';
import styles from '../../../styles/Admin.module.css';
import { FaEye, FaCartShopping, FaXmark } from 'react-icons/fa6';
import CustomSelect from '@/components/CustomSelect';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const filterOptions = [
        { value: 'all', label: 'All Status' },
        ...statusOptions
    ];

    const fetchOrders = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append('search', searchQuery);
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);

            const response = await fetch(`/api/orders?${queryParams.toString()}`);
            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [searchQuery, statusFilter]);

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                fetchOrders();
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            } else {
                alert(data.error || 'Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order');
        }
    };

    const handleDownloadInvoice = (orderId) => {
        window.open(`/api/admin/orders/${orderId}/invoice`, '_blank');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Orders</h1>
                <p>Manage customer orders and update their status</p>
            </div>

            <div className={styles.filters} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.6rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        width: '300px'
                    }}
                />

                <CustomSelect
                    options={filterOptions}
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: '200px' }}
                />
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2>All Orders ({orders.length})</h2>
                </div>

                {orders.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td><strong>{order.orderNumber}</strong></td>
                                    <td>
                                        {order.customerName}
                                        <br />
                                        <small style={{ color: '#666' }}>{order.customerEmail}</small>
                                    </td>
                                    <td>{order.items?.length || 0} items</td>
                                    <td>₹{order.total?.toLocaleString()}</td>
                                    <td>
                                        <div style={{ width: '140px' }}>
                                            <CustomSelect
                                                options={statusOptions}
                                                value={order.status}
                                                onChange={(value) => handleStatusChange(order.id, value)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${order.paymentStatus === 'paid' ? styles.paid : styles.pending}`}>
                                            {order.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                onClick={() => openOrderModal(order)}
                                                className={`${styles.actionBtn} ${styles.view}`}
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <FaCartShopping />
                        <h3>No orders yet</h3>
                        <p>Orders will appear here once customers start placing them.</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.orderModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.orderModalHeader}>
                            <h2>Order Details <span className={styles.orderNumberHighlight}>#{selectedOrder.orderNumber}</span></h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                                <FaXmark />
                            </button>
                        </div>

                        <div className={styles.orderModalBody}>
                            {/* Customer Information */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>CUSTOMER INFORMATION</h3>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label>Full Name</label>
                                        <p>{selectedOrder.customerName}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Email Address</label>
                                        <p>{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Phone Number</label>
                                        <p>{selectedOrder.customerPhone}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Shipping Address</label>
                                        <p>{selectedOrder.address}{selectedOrder.city && `, ${selectedOrder.city}, ${selectedOrder.state} - ${selectedOrder.pincode}`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>ORDER SUMMARY</h3>
                                <div className={styles.productList}>
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className={styles.productItem}>
                                            <div className={styles.productImageWrapper}>
                                                {item.image && <img src={item.image} alt={item.name} className={styles.productImageModal} />}
                                            </div>
                                            <div className={styles.productInfo}>
                                                <h4>{item.name}</h4>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                            <div className={styles.productPrice}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>PAYMENT INFO</h3>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label>Payment Method</label>
                                        <p>{selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Total Amount</label>
                                        <p className={styles.totalAmount}>₹{selectedOrder.total?.toLocaleString()}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Order Date</label>
                                        <p>{formatDate(selectedOrder.createdAt)}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label>Current Status</label>
                                        <span className={`${styles.badge} ${styles[selectedOrder.status]}`}>
                                            {selectedOrder.status?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div className={styles.orderModalSection}>
                                <h3 className={styles.sectionTitle}>UPDATE STATUS</h3>
                                <div style={{ maxWidth: '300px' }}>
                                    <CustomSelect
                                        options={statusOptions}
                                        value={selectedOrder.status}
                                        onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                                    />
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div className={styles.orderModalSection}>
                                    <h3 className={styles.sectionTitle}>ORDER NOTES</h3>
                                    <p className={styles.orderNotes}>{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.orderModalFooter}>
                            <button
                                onClick={() => setShowModal(false)}
                                className={styles.cancelOrderBtn}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDownloadInvoice(selectedOrder.id)}
                                className={styles.downloadInvoiceBtn}
                            >
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
