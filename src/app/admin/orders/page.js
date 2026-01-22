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
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Order {selectedOrder.orderNumber}</h2>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                                <FaXmark />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.orderDetails}>
                                <div className={styles.orderSection}>
                                    <h4>Customer Information</h4>
                                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                                </div>

                                <div className={styles.orderSection}>
                                    <h4>Shipping Address</h4>
                                    <p>{selectedOrder.address}</p>
                                    {selectedOrder.city && <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>}
                                </div>

                                <div className={styles.orderSection}>
                                    <h4>Order Items</h4>
                                    <ul className={styles.orderItems}>
                                        {selectedOrder.items?.map((item, index) => (
                                            <li key={index}>
                                                <span>{item.name} × {item.quantity}</span>
                                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles.orderSection}>
                                    <h4>Order Summary</h4>
                                    <p><strong>Subtotal:</strong> ₹{selectedOrder.subtotal?.toLocaleString()}</p>
                                    <p><strong>Shipping:</strong> ₹{selectedOrder.shipping?.toLocaleString() || 0}</p>
                                    <p><strong>Total:</strong> ₹{selectedOrder.total?.toLocaleString()}</p>
                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
                                </div>

                                <div className={styles.orderSection}>
                                    <h4>Update Status</h4>
                                    <CustomSelect
                                        options={statusOptions}
                                        value={selectedOrder.status}
                                        onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                                    />
                                </div>

                                {selectedOrder.notes && (
                                    <div className={styles.orderSection}>
                                        <h4>Order Notes</h4>
                                        <p>{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                onClick={() => handleDownloadInvoice(selectedOrder.id)}
                                className={styles.saveBtn}
                                style={{ marginRight: '1rem', backgroundColor: '#0A3D2E' }}
                            >
                                Download Invoice
                            </button>
                            <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
