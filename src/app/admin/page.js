'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/Admin.module.css';
import { FaBox, FaCartShopping, FaClock, FaEnvelope, FaIndianRupeeSign } from 'react-icons/fa6';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();

                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.products}`}>
                        <FaBox />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Products</h3>
                        <p>{stats?.totalProducts || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.orders}`}>
                        <FaCartShopping />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Orders</h3>
                        <p>{stats?.totalOrders || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.pending}`}>
                        <FaClock />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Pending Orders</h3>
                        <p>{stats?.pendingOrders || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.messages}`}>
                        <FaEnvelope />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Unread Messages</h3>
                        <p>{stats?.unreadMessages || 0}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.revenue}`}>
                        <FaIndianRupeeSign />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Order Price</h3>
                        <p>₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2>Recent Orders</h2>
                </div>

                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.orderNumber}</td>
                                        <td>{order.customerName}</td>
                                        <td>₹{order.total?.toLocaleString()}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <FaCartShopping />
                        <h3>No orders yet</h3>
                        <p>Orders will appear here once customers start placing them.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
